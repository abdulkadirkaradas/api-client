import { AuthorizationTokenConfig } from "../interfaces/auth";
import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from "axios";
import { ClientServices } from "../core/services/client/clientService";
import { EventBus } from "../utils/eventBus/EventBus";
import { handleAPIError } from "../utils/error/errorHandler";
import { InterceptorConstructor } from "./interceptorConstructor";
import {
  IInterceptorConfig,
  TokenRefreshConfig,
} from "../interfaces/interceptors";

/**
 * The ResponseInterceptor class is responsible for handling API responses and errors.
 * It provides functionality for:
 * - Refreshing authentication tokens when unauthorized errors occur.
 * - Retrying requests for specific HTTP status codes.
 * - Managing event bus listeners for dynamic token configuration updates.
 */
export class ResponseInterceptor extends InterceptorConstructor {
  private eventBus: EventBus; // Event bus for managing application-wide events.
  private clientService: ClientServices; // Client service for handling API requests and authentication.
  private tokenRefreshConfig: TokenRefreshConfig = {}; // Configuration for token refresh operations.
  private httpStatusCodes = {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
  }; // Common HTTP status codes used in error handling.
  private maxRetriesMap: Record<number, number> = {
    500: 3, // 3 retries for Internal Server Error.
    502: 5, // 5 retries for Bad Gateway.
    503: 5, // 5 retries for Service Unavailable.
  };

  /**
   * Constructor for the ResponseInterceptor class.
   * Initializes the event bus, client service, and registers the response interceptor.
   * @param {IInterceptorConfig} config - Configuration object containing the client and event bus.
   */
  constructor(config: IInterceptorConfig) {
    super(config.client);
    this.eventBus = config.eventBus;
    this.clientService = new ClientServices({
      client: this.client,
      eventBus: this.eventBus,
    });

    // Initialize event bus listeners for dynamic token configuration updates.
    this.initEventBusListeners();

    // Register the response interceptor to handle API responses and errors.
    this.registerInterceptor();
  }

  /**
   * Updates the token refresh configuration with the provided settings.
   * This configuration is used when attempting to refresh the access token.
   * @param {TokenRefreshConfig} config - Configuration object for token refresh.
   */
  public setTokenRefreshConfig(config: TokenRefreshConfig) {
    this.tokenRefreshConfig = { ...this.tokenRefreshConfig, ...config };
  }

  /**
   * Configures the client authentication service with the provided authorization token settings.
   * Also updates the token refresh configuration with the same settings.
   * @param {AuthorizationTokenConfig} config - Configuration object for authorization tokens.
   */
  private setClientAuthServiceConfig(config: AuthorizationTokenConfig) {
    // Update the client service's token configuration.
    this.clientService.auth.setTokenConfig(config);

    // Update the token refresh configuration.
    this.setTokenRefreshConfig({
      config: config,
    });
  }

  /**
   * Registers a response interceptor to handle API responses and errors.
   * - Handles token refresh for unauthorized errors.
   * - Retries requests for specific HTTP status codes (e.g., 500, 502, 503).
   */
  private registerInterceptor() {
    this.client.interceptors.response.use(
      // Handles successful responses.
      (response) => response,
      // Handles errors in API responses.
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & {
          retryCount?: number;
        };

        // If the error is unauthorized, attempt to refresh the token.
        if (
          this.tokenRefreshConfig.url &&
          error.response?.status === this.httpStatusCodes.unauthorized
        ) {
          console.warn("Unauthorized! Trying to refresh token...");

          try {
            const response = await this.refreshToken();
            const accessToken =
              response.data[
                this.tokenRefreshConfig.config?.requestTokenConfig
                  ?.accessTokenName || ""
              ];

            if (!accessToken) {
              throw new Error(
                "Access token is missing in the refresh token response."
              );
            }

            // Update the request headers with the new access token and retry the request.
            config.headers = new AxiosHeaders({
              ...this.client.defaults.headers.common,
              Authorization: `Bearer ${accessToken}`,
            });

            console.warn("Access token refreshed successfully!");
            return this.client(config);
          } catch (refreshError) {
            console.error("Token refresh failed. Redirected to login...");
            this.tokenRefreshConfig.storage?.remove("refreshToken");
            return Promise.reject(refreshError);
          }
        }

        // Handle specific error statuses (e.g., 400, 403, 404) using a custom error handler.
        if (
          !error.response ||
          !config ||
          [400, 403, 404].includes(error.response.status)
        ) {
          return handleAPIError(error);
        }

        // Retry logic for specific HTTP status codes (e.g., 500, 502, 503).
        const responseStatus = error.response.status;
        const maxRetries = this.maxRetriesMap[responseStatus] || 0;

        if (maxRetries > 0) {
          config.retryCount = config.retryCount || 0;

          if (config.retryCount < maxRetries) {
            config.retryCount++;

            // Introduce a delay before retrying the request.
            const delay = (config.retryCount + 1) * 1000;
            console.warn(
              `Retrying request (${config.retryCount}/${maxRetries}) in ${delay}ms...`
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.client(config);
          }
        }

        // Reject the promise if the error cannot be handled.
        return Promise.reject(error);
      }
    );
  }

  /**
   * Refreshes the authentication token by utilizing either the refresh token or access token
   * stored in the configured storage. This function ensures that the application can maintain
   * a valid authentication state by obtaining a new token when the current one expires.
   *
   * @throws {Error} Throws an error if the token configuration or storage type is missing.
   * @throws {Error} Throws an error if neither access token nor refresh token storage is available.
   * @throws {Error} Throws an error if the required token is not available in the storage.
   * @throws {Error} Throws an error if the token refresh process fails.
   *
   * @returns {Promise<any>} Returns a promise that resolves with the result of the token refresh operation.
   */
  private async refreshToken() {
    const { config } = this.tokenRefreshConfig;

    if (!config?.tokenStorageType) {
      throw new Error(
        "Token configuration or storage type is missing. At least one of configuration must be provided!"
      );
    }

    // Retrieve access token or refresh token from storage based on the configuration.
    const atStorage = config.tokenStorageType.accessToken
      ? this.clientService.auth.getStorage("accessToken")
      : null;

    const rtStorage = config.tokenStorageType.refreshToken
      ? this.clientService.auth.getStorage("refreshToken")
      : null;

    if (!atStorage && !rtStorage) {
      throw new Error(
        "Neither access token nor refresh token storage is available."
      );
    }

    // Determine which token to use for the refresh request.
    const tokenData = rtStorage
      ? { token: rtStorage.get("refreshToken"), type: "refreshToken" }
      : { token: atStorage?.get("accessToken"), type: "accessToken" };

    if (!tokenData.token) {
      throw new Error(`${tokenData.type} is not available in storage.`);
    }

    try {
      // Send the refresh token request to the server.
      return this.clientService.auth.refreshToken(
        {
          url: this.tokenRefreshConfig.url || "",
          data: { [tokenData.type]: tokenData.token },
        },
        tokenData.type === "refreshToken"
      );
    } catch (error) {
      console.error(
        `An error occurred during token refresh with ${tokenData.type}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Initializes event bus listeners for handling authentication-related events.
   * Subscribes to the "auth-client-token-config" event to dynamically update the token configuration.
   */
  private initEventBusListeners() {
    // Subscribe to the "auth-client-token-config" event on the event bus.
    this.eventBus.subscribe(
      "auth-client-token-config", // Event name
      "auth", // Event namespace
      ({ config }: { config: AuthorizationTokenConfig }) => {
        // Update the client authentication service configuration.
        this.setClientAuthServiceConfig(config);
      }
    );
  }
}

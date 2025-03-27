import { AuthorizationTokenConfig } from '../interfaces/auth';
import { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { ClientServices } from '../core/services/client/clientService';
import { EventBus } from '../utils/eventBus/EventBus';
import { handleAPIError } from '../utils/error/errorHandler';
import { InterceptorConstructor } from './interceptorConstructor';
import { IStorage } from '../interfaces/storage';
import {
  IInterceptorConfig,
  TokenRefreshConfig,
} from "../interfaces/interceptors";

export class ResponseInterceptor extends InterceptorConstructor {
  private eventBus: EventBus;
  private clientService: ClientServices;
  private tokenRefreshConfig: TokenRefreshConfig = {};
  private httpStatusCodes = {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
  };
  private maxRetriesMap: Record<number, number> = {
    500: 3, // 3 re-try for the Internal Server Error
    502: 5, // 5 re-try for Bad Gateway için
    503: 5, // 5 re-try for Service Unavailable için
  };

  constructor(config: IInterceptorConfig) {
    super(config.client);
    this.eventBus = config.eventBus;
    this.clientService = new ClientServices({
      client: this.client,
      eventBus: this.eventBus,
    });

    this.initEventBusListeners();
    this.registerInterceptor();
  }

  public setTokenRefreshConfig(config: TokenRefreshConfig) {
    this.tokenRefreshConfig = { ...this.tokenRefreshConfig, ...config };
  }

  private setClientAuthServiceConfig(config: AuthorizationTokenConfig) {
    this.clientService.auth.setTokenConfig(config);
    this.setTokenRefreshConfig({
      config: config,
    });
  }

  private registerInterceptor() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const config = error.config as InternalAxiosRequestConfig & {
          retryCount?: number;
        };

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
                  ?.refreshTokenName || ""
              ];

            if (!accessToken) {
              throw new Error(
                "Access token is missing in the refresh token response."
              );
            }

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

        if (
          !error.response ||
          !config ||
          [400, 403, 404].includes(error.response.status)
        ) {
          return handleAPIError(error);
        }

        const responseStatus = error.response.status;
        const maxRetries = this.maxRetriesMap[responseStatus] || 0;

        if (maxRetries > 0) {
          config.retryCount = config.retryCount || 0;

          if (config.retryCount < maxRetries) {
            config.retryCount++;

            const delay = (config.retryCount + 1) * 1000;
            console.warn(
              `Retrying request (${config.retryCount}/${maxRetries}) in ${delay}ms...`
            );

            await new Promise((resolve) => setTimeout(resolve, delay));
            return this.client(config);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    const { config } = this.tokenRefreshConfig;

    if (!config) {
      throw new Error("Refresh token configuration is missing.");
    }

    if (!config.tokenStorageType) {
      throw new Error("Refresh token storage configuration is missing");
    }

    const storageType = config.tokenStorageType?.refreshToken || "localStorage";

    this.clientService.setStorageType({
      rtStorage: storageType,
    });

    const rtStorage: IStorage = this.clientService.getStorage("rtStorage");

    if (!rtStorage) {
      throw new Error("Storage could not be created.");
    }

    this.setTokenRefreshConfig({
      storage: rtStorage,
    });

    const refreshToken = rtStorage?.get("refreshToken");

    if (!refreshToken) {
      throw new Error("Refresh token is not available in storage.");
    }

    try {
      const response = await this.clientService.auth.refreshToken({
        url: this.tokenRefreshConfig.url || "",
        data: { refreshToken: refreshToken },
      });

      return response;
    } catch (error) {
      console.error("An error occurred: ", error);
      throw error;
    }
  }

  private initEventBusListeners() {
    this.eventBus.subscribe(
      "auth-client-token-config",
      "auth",
      ({ config }: { config: AuthorizationTokenConfig }) => {
        this.setClientAuthServiceConfig(config);
      }
    );
  }
}

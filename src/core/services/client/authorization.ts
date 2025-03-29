import { AuthProtocolConfig } from '../../../interfaces/core';
import { AxiosResponse } from 'axios';
import { ClientStorageFactory } from '../../../utils/storage/client/storageFactory';
import { EventBus } from '../../../utils/eventBus/EventBus';
import { IServiceConstructor } from '../../../interfaces/service';
import { IStorage, StorageType } from '../../../interfaces/storage';
import { Methods } from '../../../methods/methods';
import {
  AuthorizationServiceConfig,
  AuthorizationTokenConfig,
  AuthorizationTokenType,
} from "../../../interfaces/auth";

/**
 * AuthService class mainly configures the default methods for the authentication service.
 *
 * @class AuthService
 */
export class AuthorizationService {
  // Default names for access and refresh tokens
  readonly accessTokenName: string = "accessToken";
  readonly refreshTokenName: string = "refreshToken";

  // Event bus for emitting and listening to events
  private eventBus: EventBus;

  // HTTP methods wrapper for making API requests
  private methods: Methods;

  // Configuration for the authentication protocol
  private authProtocolConfig: AuthProtocolConfig;

  // Factory for creating storage instances
  private storageFactory: ClientStorageFactory;

  // Configuration for tokens
  private tokenConfig: AuthorizationTokenConfig = {};

  // Storage instances for access and refresh tokens
  private tokenStorage: { accessToken?: IStorage; refreshToken?: IStorage } =
    {};

  // List of HTTP status codes considered successful
  private statusCodes: Array<Number> = [200, 201];

  /**
   * Constructor for the AuthorizationService class.
   *
   * @param config - Configuration object for initializing the service.
   */
  constructor(config: IServiceConstructor) {
    this.eventBus = config.eventBus; // Initialize the event bus
    this.authProtocolConfig = config.authProtocol; // Set authentication protocol configuration
    this.methods = new Methods(config.client); // Initialize HTTP methods wrapper
    this.storageFactory = new ClientStorageFactory(); // Create a storage factory instance

    this.setTokenConfig(config.tokenConfig || {}); // Set initial token configuration
  }

  /**
   * Sets token configurations.
   *
   * @param config - Configuration object for tokens.
   */
  public setTokenConfig(config: AuthorizationTokenConfig): void {
    // Check if the new configuration differs from the existing one
    const isConfigChanged =
      JSON.stringify(this.tokenConfig) !== JSON.stringify(config);

    if (isConfigChanged) {
      this.tokenConfig = { ...this.tokenConfig, ...config }; // Merge new config with existing one
      this.createStorage(this.tokenConfig); // Create storage for tokens

      // Emit an event to notify about the token configuration change
      this.eventBus.emit("auth-client-token-config", "auth", {
        config:
          Object.keys(this.tokenConfig).length !== 0 ? this.tokenConfig : {},
      });
    }
  }

  /**
   * Returns the existing token configuration.
   *
   * @returns The current token configuration.
   */
  public getTokenConfig(): AuthorizationTokenConfig {
    return this.tokenConfig;
  }

  /**
   * Creates the storage for both authentication and refresh tokens.
   *
   * @param config - Configuration object for tokens.
   */
  protected createStorage(config: AuthorizationTokenConfig): void {
    // Supported storage types
    const storageTypes: StorageType[] = [
      "localStorage",
      "sessionStorage",
      "cookie",
      "json",
    ];

    // Helper function to create storage for a specific token type
    const createTokenStorage = (
      type: StorageType | null | undefined,
      tokenName: "accessToken" | "refreshToken"
    ) => {
      if (type && storageTypes.includes(type)) {
        this.tokenStorage[tokenName] = this.storageFactory.createStorage(type);
      }
    };

    // Create storage for access and refresh tokens
    createTokenStorage(
      config.tokenStorageType?.accessToken ?? null,
      "accessToken"
    );
    createTokenStorage(
      config.tokenStorageType?.refreshToken ?? null,
      "refreshToken"
    );
  }

  /**
   * Returns the storage for the token.
   *
   * @param tokenType - The type of token (accessToken or refreshToken).
   * @returns The storage instance for the specified token type.
   */
  public getStorage(tokenType: AuthorizationTokenType): IStorage | any {
    return tokenType === "accessToken"
      ? this.tokenStorage.accessToken
      : this.tokenStorage.refreshToken;
  }

  /**
   * Sets the authentication token in the storage.
   *
   * @param token - The token value to be stored.
   * @param tokenType - The type of token (accessToken or refreshToken).
   */
  protected setToken(token: string, tokenType: AuthorizationTokenType): void {
    const storage = this.getStorage(tokenType); // Get the storage instance for the token type
    const tokenName =
      tokenType === "accessToken"
        ? this.accessTokenName
        : this.refreshTokenName;

    if (storage && tokenName) {
      storage.remove(tokenName); // Remove any existing token
      storage.set(tokenName, token); // Store the new token
    } else {
      throw new Error(`Token storage or name is not defined for ${tokenType}.`);
    }
  }

  /**
   * Removes the authentication token from the storage.
   *
   * @param tokenType - The type of token (accessToken or refreshToken).
   */
  protected removeToken(tokenType: AuthorizationTokenType): void {
    const storage = this.getStorage(tokenType); // Get the storage instance for the token type
    const tokenName =
      tokenType === "accessToken"
        ? this.accessTokenName
        : this.refreshTokenName;

    if (storage && tokenName) {
      storage.remove(tokenName); // Remove the token from storage
    } else {
      throw new Error(
        `Token name: '${tokenName}' for '${tokenType}' is not defined.`
      );
    }
  }

  /**
   * Handles the token response and sets the token in the storage.
   *
   * @param response - The HTTP response containing the token.
   * @param tokenType - The type of token (accessToken or refreshToken).
   */
  protected handleTokenResponse(
    response: AxiosResponse,
    tokenType: AuthorizationTokenType
  ): void {
    const tokenName =
      tokenType === "accessToken"
        ? this.tokenConfig.requestTokenConfig?.accessTokenName
        : this.tokenConfig.requestTokenConfig?.refreshTokenName;
    const token = response.data[tokenName || ""]; // Extract the token from the response
    if (token) {
      this.setToken(token, tokenType); // Store the token
    } else {
      throw new Error(`${tokenType} token not found in response.data bag.`);
    }
  }

  /**
   * Logs in the user and sets the authentication token in the storage.
   *
   * @param config - Configuration object for the login request.
   * @returns The HTTP response from the login request.
   */
  public async login(
    config: AuthorizationServiceConfig
  ): Promise<AxiosResponse<any, any>> {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response || !this.statusCodes.includes(response.status)) {
      throw response; // Throw an error if the response status is not successful
    }

    if (
      this.tokenConfig.requestTokenConfig?.accessTokenName ||
      this.tokenConfig.requestTokenConfig?.refreshTokenName
    ) {
      if (this.authProtocolConfig.useOAUTHProtocol) {
        this.handleTokenResponse(
          response,
          this.refreshTokenName as AuthorizationTokenType
        );
      }

      this.handleTokenResponse(
        response,
        this.accessTokenName as AuthorizationTokenType
      );

      if (this.tokenConfig.requestTokenConfig.accessTokenName) {
        this.eventBus.emit("auth-client-login:sent", "auth", {
          sent: true,
          storage: this.getStorage("accessToken"),
        });
      }
    }

    return response;
  }

  /**
   * Registers the user and sets the authentication token in the storage.
   *
   * @param config - Configuration object for the registration request.
   * @returns The HTTP response from the registration request.
   */
  public async register(
    config: AuthorizationServiceConfig
  ): Promise<AxiosResponse<any, any>> {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response || !this.statusCodes.includes(response.status)) {
      throw response; // Throw an error if the response status is not successful
    }

    return response;
  }

  /**
   * Logs out the user and removes the authentication token from the storage.
   *
   * @param config - Configuration object for the logout request.
   * @returns The HTTP response from the logout request.
   */
  public async logout(
    config: AuthorizationServiceConfig
  ): Promise<AxiosResponse<any, any>> {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response || !this.statusCodes.includes(response.status)) {
      throw response; // Throw an error if the response status is not successful
    }

    // Remove both access and refresh tokens from storage
    [this.accessTokenName, this.refreshTokenName].forEach((tokenType) =>
      this.removeToken(tokenType as AuthorizationTokenType)
    );

    return response;
  }

  /**
   * Refreshes the authentication token.
   *
   * @param config - Configuration object for the token refresh request.
   * @returns The HTTP response from the token refresh request.
   */
  public async refreshToken(
    config: AuthorizationServiceConfig
  ): Promise<AxiosResponse<any, any>> {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response || !this.statusCodes.includes(response.status)) {
      throw response; // Throw an error if the response status is not successful
    }

    // Handle both access and refresh tokens if applicable
    [
      this.accessTokenName,
      this.authProtocolConfig.useOAUTHProtocol && this.refreshTokenName,
    ]
      .filter(Boolean)
      .forEach((tokenType) =>
        this.handleTokenResponse(response, tokenType as AuthorizationTokenType)
      );

    return response;
  }
}

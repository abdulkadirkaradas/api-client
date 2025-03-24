import { AxiosInstance, AxiosResponse } from "axios";
import {
  AuthorizationServiceConfig,
  AuthorizationTokenConfig,
  AuthorizationTokenType,
} from "../../../interfaces/auth";
import { Methods } from "../../../methods/methods";
import { IStorage, StorageType } from "../../../interfaces/storage";
import { ClientStorageFactory } from "../../../utils/storage/client/storageFactory";
import { EventBus } from "../../../utils/eventBus/EventBus";
import { IServiceConstructor } from "../../../interfaces/service";

/**
 * AuthService class mainly configures the default methods for the authentication service.
 *
 * @class AuthService
 */
export class AuthorizationService {
  readonly accessTokenName: string = "accessToken";
  readonly refreshTokenName: string = "refreshToken";

  private eventBus: EventBus;
  private tokenConfig: AuthorizationTokenConfig;
  private methods: Methods;
  private storageFactory: ClientStorageFactory;
  private tokenStorage: { accessToken?: IStorage; refreshToken?: IStorage } =
    {};
  private requestToken: AuthorizationTokenConfig["requestTokenConfig"];
  private statusCodes: Array<Number> = [200, 201];

  constructor(config: IServiceConstructor) {
    this.tokenConfig = config.tokenConfig || {};
    this.eventBus = config.eventBus;

    this.methods = new Methods(config.client);
    this.storageFactory = new ClientStorageFactory();
    this.requestToken = {
      accessTokenName: config.tokenConfig?.requestTokenConfig?.accessTokenName,
      refreshTokenName:
        config.tokenConfig?.requestTokenConfig?.refreshTokenName,
    };

    this.createStorage(config.tokenConfig || {});
  }

  /**
   * Sets token configurations
   *
   * @param config
   */
  public setTokenConfig(config: AuthorizationTokenConfig): void {
    this.tokenConfig = config;
    this.createStorage(config);
  }

  //TODO This method will be removed in full version. For now used for testing purposes.
  public getTokenConfig() {
    return this.tokenConfig;
  }

  /**
   * Creates the storage for both authentication and refresh tokens.
   *
   * @param config
   */
  protected createStorage(config: AuthorizationTokenConfig): void {
    const storageTypes: StorageType[] = [
      "localStorage",
      "sessionStorage",
      "cookie",
    ];
    let accessTokenType =
      config.tokenStorageType?.accessToken || "localStorage";
    let refreshTokenType =
      config.tokenStorageType?.refreshToken || "localStorage";

    if (
      config.tokenStorageType?.accessToken &&
      storageTypes.includes(accessTokenType)
    ) {
      this.tokenStorage.accessToken =
        this.storageFactory.createStorage(accessTokenType);
    }

    if (
      config.tokenStorageType?.refreshToken &&
      storageTypes.includes(refreshTokenType)
    ) {
      this.tokenStorage.refreshToken =
        this.storageFactory.createStorage(refreshTokenType);
    }
  }

  /**
   * Returns the storage for the token.
   *
   * @param tokenType
   */
  protected getStorage(tokenType: AuthorizationTokenType): IStorage | any {
    return tokenType === "accessToken"
      ? this.tokenStorage.accessToken
      : this.tokenStorage.refreshToken;
  }

  /**
   * Sets the authentication token in the storage.
   *
   * @param config
   * @param token
   * @param tokenType
   */
  protected setToken(token: string, tokenType: AuthorizationTokenType): void {
    const storage = this.getStorage(tokenType);
    const tokenName =
      tokenType === "refreshToken"
        ? this.accessTokenName
        : this.refreshTokenName;

    if (storage && tokenName) {
      storage.remove(tokenName);
      storage.set(tokenName, token);
    } else {
      throw new Error(`Token storage or name is not defined for ${tokenType}.`);
    }
  }

  /**
   * Removes the authentication token from the storage.
   *
   * @param config
   * @param tokenType
   */
  protected removeToken(tokenType: AuthorizationTokenType): void {
    const storage = this.getStorage(tokenType);
    const tokenName =
      tokenType === "accessToken"
        ? this.accessTokenName
        : this.refreshTokenName;

    if (storage && tokenName) {
      storage.remove(tokenName);
    } else {
      throw new Error(
        `Token name: '${tokenName}' for '${tokenType}' is not defined.`
      );
    }
  }

  /**
   * Handles the token response and sets the token in the storage.
   *
   * @param response
   * @param config
   * @param tokenType
   */
  protected handleTokenResponse(
    response: AxiosResponse,
    tokenType: AuthorizationTokenType
  ): void {
    const tokenName =
      tokenType === "accessToken"
        ? this.requestToken?.accessTokenName
        : this.requestToken?.refreshTokenName;
    const token = response.data[tokenName || ""];
    if (token) {
      this.setToken(token, tokenType);
    }
  }

  /**
   * Logs in the user and sets the authentication token in the storage.
   *
   * @param config
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
      throw response;
    }

    if (
      this.requestToken?.accessTokenName ||
      this.requestToken?.refreshTokenName
    ) {
      [this.accessTokenName, this.refreshTokenName].forEach((type) => {
        this.handleTokenResponse(response, type as AuthorizationTokenType);
      });

      if (this.requestToken.accessTokenName) {
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
   * @param config
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
      throw response;
    }

    this.handleTokenResponse(response, "accessToken");
    this.handleTokenResponse(response, "refreshToken");

    return response;
  }

  /**
   * Logs out the user and removes the authentication token from the storage.
   *
   * @param config
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
      throw response;
    }

    [this.accessTokenName, this.refreshTokenName].forEach((tokenType) =>
      this.removeToken(tokenType as AuthorizationTokenType)
    );

    return response;
  }

  /**
   * Refreshes the authentication token.
   *
   * If you are using a 'refresh' and 'authorization' token structure, the 'refreshTokenExists' flag should be activated
   * and appropriate authorization and refresh token names (returned from the API) should be provided.
   *
   * If only the authorization token structure is used, it can continue to be used by default config.
   *
   * @param config
   * @param refreshTokenExists
   */
  public async refreshToken(
    config: AuthorizationServiceConfig,
    refreshTokenExists = false
  ): Promise<AxiosResponse<any, any>> {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response || !this.statusCodes.includes(response.status)) {
      throw response;
    }

    [this.accessTokenName, refreshTokenExists && this.refreshTokenName]
      .filter(Boolean)
      .forEach((tokenType) =>
        this.handleTokenResponse(response, tokenType as AuthorizationTokenType)
      );

    return response;
  }
}

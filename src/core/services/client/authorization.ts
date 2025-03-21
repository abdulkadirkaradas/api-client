import { AxiosInstance, AxiosResponse } from "axios";
import {
  AuthorizationServiceConfig,
  AuthorizationTokenConfig,
  AuthorizationTokenType,
} from "../../../interfaces/auth";
import { Methods } from "../../../methods/methods";
import { IStorage, StorageType } from "../../../interfaces/storage";
import { ClientStorageFactory } from "../../../utils/storage/client/storageFactory";

/**
 * AuthService class mainly configures the default methods for the authentication service.
 *
 * @class AuthService
 */
export class AuthorizationService {
  readonly accessTokenName: string = "accessToken";
  readonly refreshTokenName: string = "refreshToken";

  private tokenConfig: AuthorizationTokenConfig;
  private methods: Methods;
  private storageFactory: ClientStorageFactory;
  private tokenStorage: { accessToken?: IStorage; refreshToken?: IStorage } =
    {};
  private requestToken: AuthorizationTokenConfig["requestTokenConfig"];
  private statusCodes: Array<Number> = [200, 201];

  constructor(client: AxiosInstance, tokenConfig: AuthorizationTokenConfig) {
    this.tokenConfig = tokenConfig;

    this.methods = new Methods(client);
    this.storageFactory = new ClientStorageFactory();
    this.requestToken = {
      accessTokenName: tokenConfig.requestTokenConfig?.accessTokenName,
      refreshTokenName: tokenConfig.requestTokenConfig?.refreshTokenName,
    };

    this.createStorage(tokenConfig);
  }

  /**
   * Sets token configurations
   *
   * @param config
   */
  public setTokenConfig(config: AuthorizationTokenConfig) {
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
  private createStorage(config: AuthorizationTokenConfig) {
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
  private getStorage(tokenType: AuthorizationTokenType) {
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
  private setToken(token: string, tokenType: AuthorizationTokenType) {
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
  private removeToken(tokenType: AuthorizationTokenType) {
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
  private handleTokenResponse(
    response: AxiosResponse,
    tokenType: AuthorizationTokenType
  ) {
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
  public async login(config: AuthorizationServiceConfig) {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response) {
      throw new Error("Response is undefined!");
    }

    if (
      this.requestToken?.accessTokenName === undefined &&
      this.requestToken?.refreshTokenName === undefined
    ) {
      return response;
    }

    if (response.data && this.statusCodes.includes(response.status)) {
      //TODO 'handleTokenResponse' calls will be merged and simplified
      this.handleTokenResponse(response, "accessToken");
      this.handleTokenResponse(response, "refreshToken");

      return response;
    } else {
      throw new Error(`Error in login: ${response.data}`);
    }
  }

  /**
   * Registers the user and sets the authentication token in the storage.
   *
   * @param config
   */
  public async register(config: AuthorizationServiceConfig) {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (this.statusCodes.includes(response.status)) {
      this.handleTokenResponse(response, "accessToken");
      this.handleTokenResponse(response, "refreshToken");

      return response;
    } else {
      throw new Error(`Error in registration: ${response.data}`);
    }
  }

  /**
   * Logs out the user and removes the authentication token from the storage.
   *
   * @param config
   */
  public async logout(config: AuthorizationServiceConfig) {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (this.statusCodes.includes(response.status)) {
      //TODO 'removeToken' calls will be merged and simplified
      this.removeToken("accessToken");
      this.removeToken("refreshToken");

      return response;
    } else {
      throw new Error(`Error in logout: ${response.data}`);
    }
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
    refreshTokenExists?: boolean
  ) {
    const response = await this.methods.post(
      config.url,
      config.data,
      config.config
    );

    if (!response) {
      throw new Error(`Error in refresh token: ${response}`);
    }

    if (response.status && this.statusCodes.includes(response.status)) {
      this.handleTokenResponse(response, "accessToken");
      if (refreshTokenExists) {
      this.handleTokenResponse(response, "refreshToken");
      }
    }

    return response;
  }
}

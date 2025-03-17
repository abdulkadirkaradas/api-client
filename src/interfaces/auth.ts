import { AxiosRequestConfig } from "axios";
import { StorageType } from "./storage";
import { APIClientConfig } from "./core";

export interface AuthorizationServiceConfig {
  url: string;
  data?: AxiosRequestConfig["data"];
  config?: APIClientConfig;
}

export interface AuthorizationTokenConfig {
  requestTokenConfig?: {
    accessTokenName?: string | null;
    refreshTokenName?: string | null;
  };
  tokenStorageType?: {
    accessToken?: StorageType | null;
    refreshToken?: StorageType | null;
  };
}

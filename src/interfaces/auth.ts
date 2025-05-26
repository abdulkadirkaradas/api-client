import { AxiosRequestConfig } from "axios";
import { WebStorageType } from "./storages/storage";
import { APIClientConfig } from "./core";

export interface AuthorizationServiceConfig {
  url: string;
  data?: AxiosRequestConfig["data"];
  config?: APIClientConfig;
}

export type AuthorizationTokenType = 'accessToken' | 'refreshToken';

export interface AuthorizationTokenConfig {
  requestTokenConfig?: {
    accessTokenName?: string | null;
    refreshTokenName?: string | null;
  };
  tokenStorageType?: {
    accessToken?: WebStorageType | null;
    refreshToken?: WebStorageType | null;
  };
}

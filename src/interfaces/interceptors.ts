import { AuthorizationTokenConfig } from "./auth";
import { AxiosInstance, RawAxiosRequestHeaders } from "axios";
import { EventBus } from "../utils/eventBus/EventBus";
import { IStorage } from "./storages/storage";
import { AuthProtocolConfig } from "./auth";

export type CommonRequestHeadersList =
  | "Accept"
  | "Content-Length"
  | "User-Agent"
  | "Content-Encoding"
  | "Authorization"
  | "Content-Type";

export interface IInterceptorConfig {
  client: AxiosInstance;
  eventBus: EventBus;
  authProtocol: AuthProtocolConfig;
  tokenRefreshConfig?: ResponseTokenRefreshConfig;
  headers?: RawAxiosRequestHeaders;
}

export interface ResponseTokenRefreshConfig {
  url?: string;
  config?: AuthorizationTokenConfig;
  storage?: IStorage;
}

export interface AuthRequestsSent {
  login?: boolean;
  logout?: boolean;
  register?: boolean;
  refreshToken?: boolean;
};
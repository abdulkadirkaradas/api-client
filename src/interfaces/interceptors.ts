import { AuthorizationTokenConfig } from './auth';
import { AxiosInstance, RawAxiosRequestHeaders } from 'axios';
import { EventBus } from '../utils/eventBus/EventBus';
import { IStorage } from './storage';

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
  headers?: RawAxiosRequestHeaders;
}

export interface RefreshTokenEventConfig {
  url?: string;
  config?: AuthorizationTokenConfig;
  storage?: IStorage;
}

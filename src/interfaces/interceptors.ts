import { AxiosHeaderValue, AxiosInstance, RawAxiosRequestHeaders } from "axios";
import { EventBus } from "../utils/eventBus/EventBus";

export type CommonRequestHeadersList =
  | "Accept"
  | "Content-Length"
  | "User-Agent"
  | "Content-Encoding"
  | "Authorization"
  | "Content-Type";

export interface IInterceptorConfig {
  client: AxiosInstance;
  headers: RawAxiosRequestHeaders;
  eventBus: EventBus;
}
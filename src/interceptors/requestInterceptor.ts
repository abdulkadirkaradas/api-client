import { EventBus } from "../utils/eventBus/EventBus";
import { InterceptorConstructor } from "./interceptorConstructor";
import { IStorage } from "../interfaces/storage";
import {
  AxiosHeaders,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import {
  CommonRequestHeadersList,
  IInterceptorConfig,
} from "../interfaces/interceptors";

export class RequestInterceptor extends InterceptorConstructor {
  private headers: RawAxiosRequestHeaders;
  private eventBus: EventBus;

  private readonly accessTokenName: string = "accessToken";

  constructor(config: IInterceptorConfig) {
    super(config.client);
    this.headers = config.headers;
    this.eventBus = config.eventBus;

    this.initEventBusListeners();
    this.registerInterceptor();
  }

  /**
   * Updates the headers to be added to the request
   *
   * @param headers
   */
  public setHeaders(headers: RawAxiosRequestHeaders) {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Returns the specified header value
   *
   * @param header
   */
  public getHeaderValue(header: CommonRequestHeadersList) {
    return this.headers[header];
  }

  /**
   * Returns the all exists headers
   */
  public getAllHeaders(): RawAxiosRequestHeaders {
    return this.headers;
  }

  /**
   * Registers the interceptor and adds the provided headers to the request headers
   */
  private registerInterceptor() {
    this.client.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
        if (this.headers) {
          request.headers = AxiosHeaders.from({
            ...request.headers,
            ...this.headers,
          });
        }

        return request;
      },
      (error) => Promise.reject(error)
    );
  }

  private initEventBusListeners() {
    this.eventBus.subscribe(
      "auth-client-login:sent",
      "auth",
      ({ sent, storage }: { sent: boolean; storage: IStorage }) => {
        let accessToken = storage.get(this.accessTokenName);

        if (sent && accessToken) {
          this.setHeaders({
            Authorization: `Bearer ${accessToken}`,
          });
        }
      }
    );
  }
}

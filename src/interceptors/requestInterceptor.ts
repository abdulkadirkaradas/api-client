import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import { InterceptorConstructor } from "./interceptorConstructor";
import { CommonRequestHeadersList } from "../interfaces/test";

export class RequestInterceptor extends InterceptorConstructor {
  protected headers: RawAxiosRequestHeaders = {};

  constructor(client: AxiosInstance, headers: RawAxiosRequestHeaders) {
    super(client);

    this.headers = headers;
    this.registerInterceptor();
  }

  /**
   * Updates the headers to be added to the request
   *
   * @param headers {RawAxiosRequestHeaders} - The new headers to be added to the request
   */
  public setHeaders(headers: RawAxiosRequestHeaders) {
    this.headers = headers;
  }

  /**
   * Returns the value of the header
   * 
   * @param header 
   * @returns 
   */
  public getHeaderValue(header: CommonRequestHeadersList) {
    return this.headers[header];
  }

  /**
   * Registers the interceptor and adds the provided headers to the request headers
   */
  private registerInterceptor() {
    this.client.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
        for (const header in this.headers) {
          request.headers[header] = this.headers[header];
        }
        return request;
      },
      (error) => Promise.reject(error)
    );
  }
}

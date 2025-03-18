import { AxiosInstance, AxiosResponse, RawAxiosResponseHeaders } from "axios";
import { InterceptorConstructor } from "./interceptorConstructor";
import { CommonResponseHeadersList } from "../interfaces/test";

export class ResponseInterceptor extends InterceptorConstructor {
  private headers: RawAxiosResponseHeaders = {};

  constructor(client: AxiosInstance, headers: RawAxiosResponseHeaders = {}) {
    super(client);

    this.headers = headers;
    this.registerInterceptor();
  }

  /**
   * Updates the response headers manually
   *
   * @param headers
   */
  public setHeaders(headers: RawAxiosResponseHeaders) {
    this.headers = headers;
  }

  /**
   * Returns the value of the header
   *
   * @param header
   * @returns
   */
  public getHeaderValue(header: CommonResponseHeadersList) {
    return this.headers[header];
  }

  /**
   * Registers the interceptor and adds the provided headers to the response headers
   */
  private registerInterceptor() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        for (const header in this.headers) {
          if (this.headers.hasOwnProperty(header)) {
            response.headers[header] = this.headers[header];
          }
        }

        return response;
      },
      (error) => {
        Promise.reject(error);
      }
    );
  }
}

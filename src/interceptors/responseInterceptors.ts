import { AxiosInstance, AxiosResponse, RawAxiosResponseHeaders } from "axios";
import { InterceptorConstructor } from "./interceptorConstructor";
import { CommonResponseHeadersList } from "../interfaces/test";
import { handleAPIError } from "../utils/error/errorHandler";

export class ResponseInterceptor extends InterceptorConstructor {
  constructor(client: AxiosInstance) {
    super(client);

    this.registerInterceptor();
  }

  private registerInterceptor() {
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        handleAPIError(error);
      }
    );
  }
}

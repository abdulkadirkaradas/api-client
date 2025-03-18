import { RequestInterceptor } from "../interceptors/requestInterceptor";
import { ResponseInterceptor } from "../interceptors/responseInterceptors";
import { APIClientConfig } from "../interfaces/core";
import { Methods } from "../methods/methods";
import { APIClientConstructor } from "./apiClientConstructor";

export class APIClient extends APIClientConstructor {
  public methods: Methods;
  public interceptor: { request: RequestInterceptor, response: ResponseInterceptor };

  constructor(config: APIClientConfig) {
    super(config);

    this.methods = new Methods(this.client);
    this.interceptor = {
      request: new RequestInterceptor(this.client, config?.headers || {}),
      response: new ResponseInterceptor(this.client, config?.headers || {}),
    };
  }
}

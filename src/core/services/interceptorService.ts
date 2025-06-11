import { IInterceptorConfig } from "../../interfaces/interceptors";
import { RequestInterceptor } from "../../interceptors/requestInterceptor";
import { ResponseInterceptor } from "../../interceptors/responseInterceptors";

/**
 * The `InterceptorService` class is responsible for managing request and response interceptors
 * in an API client. It provides a centralized way to handle and configure interceptors
 * for HTTP requests and responses, enabling features such as authentication, custom headers,
 * and event-driven behavior.
 *
 * @class InterceptorService
 */
export class InterceptorService {
  public request: RequestInterceptor;
  public response: ResponseInterceptor;

  constructor(config: IInterceptorConfig) {
    this.request = new RequestInterceptor({
      client: config.client,
      eventBus: config.eventBus,
      authProtocol: config.authProtocol,
      headers: config.headers,
    });

    this.response = new ResponseInterceptor({
      client: config.client,
      eventBus: config.eventBus,
      authProtocol: config.authProtocol,
      tokenRefreshConfig: config.tokenRefreshConfig || {},
    });
  }
}

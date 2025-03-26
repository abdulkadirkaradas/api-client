import { IInterceptorConfig } from "../../interfaces/interceptors";
import { RequestInterceptor } from "../../interceptors/requestInterceptor";
import { ResponseInterceptor } from "../../interceptors/responseInterceptors";

export class InterceptorService {
  public request: RequestInterceptor;
  public response: ResponseInterceptor;

  constructor(config: IInterceptorConfig) {
    this.request = new RequestInterceptor({
      client: config.client,
      eventBus: config.eventBus,
      headers: config.headers,
    });

    this.response = new ResponseInterceptor({
      client: config.client,
      eventBus: config.eventBus
    });
  }
}

import { InterceptorService } from "./services/interceptorService";
import { APIClientConfig } from "../interfaces/core";
import { Methods } from "../methods/methods";
import { APIClientConstructor } from "./apiClientConstructor";

export class APIClient extends APIClientConstructor {
  public methods: Methods;
  public interceptorService: InterceptorService;

  constructor(config: APIClientConfig) {
    super(config);

    this.methods = new Methods(this.client);

    this.interceptorService = new InterceptorService({
      client: this.client,
      headers: config.headers || {},
      eventBus: this.getEventBusInstance()
    });
  }
}

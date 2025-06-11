import { InterceptorService } from "./services/interceptorService";
import { APIClientConfig } from "../interfaces/core";
import { Methods } from "../methods/methods";
import { APIClientConstructor } from "./apiClientConstructor";

/**
 * The `APIClient` class is responsible for managing API interactions.
 * It extends the `APIClientConstructor` class and provides additional
 * functionality such as HTTP methods and request/response interceptors.
 *
 * @class APIClient
 */
export class APIClient extends APIClientConstructor {
  public methods: Methods;
  public interceptorService: InterceptorService;

  constructor(config: APIClientConfig) {
    super(config);

    const authProtocolConfig = this.getAuthProtocolConfig();

    this.methods = new Methods(this.client);
    this.interceptorService = new InterceptorService({
      client: this.client,
      headers: config.headers || {},
      eventBus: this.getEventBusInstance(),
      authProtocol: {
        useAuthProtocol: authProtocolConfig?.useAuthProtocol || true,
        useOAUTHProtocol: authProtocolConfig?.useOAUTHProtocol || false,
      },
    });
  }
}

import { AxiosInstance } from "axios";

/**
 * Base class for all sub-interceptor classes
 *
 * @param client
 */
export class InterceptorConstructor {
  protected client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }
}

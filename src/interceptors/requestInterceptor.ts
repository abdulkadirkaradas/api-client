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

/**
 * The `RequestInterceptor` class is responsible for managing and injecting headers into outgoing Axios requests.
 * It also listens to specific events via an event bus to dynamically update headers, such as the Authorization token.
 * 
 * This class extends the `InterceptorConstructor` and provides methods to set, retrieve, and manage headers.
 * It also registers an Axios request interceptor to ensure headers are included in all outgoing requests.
 */
export class RequestInterceptor extends InterceptorConstructor {
  // Stores the headers to be added to outgoing requests
  private headers: RawAxiosRequestHeaders;

  // Event bus instance for subscribing to and handling events
  private eventBus: EventBus;

  // The name of the access token key in storage
  private readonly accessTokenName: string = "accessToken";

  /**
   * Initializes the `RequestInterceptor` instance with the provided configuration.
   * Sets up the headers, event bus, and registers the interceptor.
   *
   * @param config - Configuration object containing the Axios client, headers, and event bus
   */
  constructor(config: IInterceptorConfig) {
    super(config.client);
    this.headers = config.headers || {};
    this.eventBus = config.eventBus;

    // Initialize event listeners for handling specific events
    this.initEventBusListeners();

    // Register the Axios request interceptor
    this.registerInterceptor();
  }

  /**
   * Updates the headers to be included in outgoing requests.
   * Merges the new headers with the existing ones.
   *
   * @param headers - An object containing the headers to be added
   */
  public setHeaders(headers: RawAxiosRequestHeaders) {
    this.headers = { ...this.headers, ...headers };
  }

  /**
   * Retrieves the value of a specific header.
   *
   * @param header - The name of the header to retrieve
   * @returns The value of the specified header, or undefined if it doesn't exist
   */
  public getHeaderValue(header: CommonRequestHeadersList) {
    return this.headers[header];
  }

  /**
   * Retrieves all currently stored headers.
   *
   * @returns An object containing all headers
   */
  public getAllHeaders(): RawAxiosRequestHeaders {
    return this.headers;
  }

  /**
   * Registers an Axios request interceptor that adds the stored headers
   * to every outgoing request. If headers are defined, they are merged
   * with the existing request headers.
   */
  private registerInterceptor() {
    this.client.interceptors.request.use(
      (request: InternalAxiosRequestConfig) => {
        // If headers are defined, merge them with the request's existing headers
        if (this.headers) {
          request.headers = AxiosHeaders.from({
            ...request.headers,
            ...this.headers,
          });
        }

        // Return the modified request
        return request;
      },
      // Handle request errors by rejecting the promise
      (error) => Promise.reject(error)
    );
  }

  /**
   * Initializes event listeners for the event bus. Specifically listens
   * for the "auth-client-login:sent" event to update the Authorization header
   * with a Bearer token if the event indicates a successful login.
   */
  private initEventBusListeners() {
    this.eventBus.subscribe(
      "auth-client-login:sent", // Event name
      "auth", // Event namespace
      ({ sent, storage }: { sent: boolean; storage: IStorage }) => {
        // Retrieve the access token from storage
        let accessToken = storage.get(this.accessTokenName);

        // If the login event was sent and an access token exists, update the headers
        if (sent && accessToken) {
          this.setHeaders({
            Authorization: `Bearer ${accessToken}`,
          });
        }
      }
    );
  }
}

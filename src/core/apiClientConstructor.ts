import axios, { AxiosInstance } from "axios";
import { APIClientConfig } from "../interfaces/core";
import { EventBus } from "../utils/eventBus/EventBus";

type ExcludedAuthClientConfig = Omit<
  APIClientConfig,
  "authProtocol" | "tokenConfig"
>;

/**
 * The `APIClientConstructor` class is a base class for creating an API client.
 * It initializes an Axios instance for making HTTP requests and an EventBus
 * for managing application-wide events.
 */
export class APIClientConstructor {
  protected client: AxiosInstance;
  protected eventBus: EventBus;
  private config: APIClientConfig;

  /**
   * Constructor for the `APIClientConstructor` class.
   *
   * @param config - Configuration object for initializing the API client.
   */
  constructor(config: APIClientConfig) {
    const excludedConfig: ExcludedAuthClientConfig = config;

    this.config = config;
    this.client = axios.create(excludedConfig);
    this.eventBus = new EventBus();
  }

  /**
   * Returns the Axios instance used by the API client.
   *
   * @returns The Axios instance.
   */
  public getInstance(): AxiosInstance {
    return this.client as AxiosInstance;
  }

  /**
   * Returns the EventBus instance used by the API client.
   *
   * @returns The EventBus instance.
   */
  public getEventBusInstance(): EventBus {
    return this.eventBus as EventBus;
  }

  /**
   * Returns the authentication protocol configuration.
   *
   * @returns The authentication protocol configuration from the client config.
   */
  public getAuthProtocolConfig() {
    return this.config.authProtocol;
  }
}
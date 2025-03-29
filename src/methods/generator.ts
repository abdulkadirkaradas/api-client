import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { GeneratedMethods, RequestConfig } from "../interfaces/methods";

/**
 * Class responsible for dynamically generating HTTP methods
 * based on provided configurations.
 */
export class MethodGenerator {
  // Axios client instance used for making HTTP requests
  private client: AxiosInstance;

  // Array to store the configuration of methods to be generated
  private methodsConfig: RequestConfig[] = [];

  // Array to track the names of already generated methods to avoid duplicates
  private existsMethodNames: string[] = [];

  /**
   * Constructor to initialize the MethodGenerator with an Axios client.
   * 
   * @param client {AxiosInstance} - The Axios client instance
   */
  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Binds the methods configuration to the generator.
   * This configuration will be used to generate HTTP methods dynamically.
   * 
   * @param methodsConfig {RequestConfig[]} - The configuration of the methods
   */
  public bind(methodsConfig: RequestConfig[]): void {
    this.methodsConfig = methodsConfig; // Store the provided method configurations
  }

  /**
   * Generates and returns the methods based on the specified configurations.
   * Each method is dynamically created and bound to the configuration provided.
   * 
   * @returns {GeneratedMethods<typeof this.methodsConfig>} - An object containing the generated methods
   * @throws {Error} - Throws an error if the HTTP method is missing or if a duplicate method name is detected
   */
  public getMethods(): GeneratedMethods<typeof this.methodsConfig> {
    // Initialize an empty object to store the generated methods
    const methods: GeneratedMethods<typeof this.methodsConfig> = {} as GeneratedMethods<typeof this.methodsConfig>;

    // Iterate over each method configuration
    this.methodsConfig.forEach((config) => {
      const name = config.methodName; // Extract the method name from the configuration
      const method = config.method; // Extract the HTTP method (e.g., GET, POST)

      // Validate that the HTTP method is not null or undefined
      if (!method) {
        throw new Error(`HTTP method for "${name}" cannot be empty or null.`);
      }

      // Check if the method name already exists to prevent duplicates
      if (this.existsMethodNames.length !== 0 && this.existsMethodNames.includes(name)) {
        throw new Error(`Method name "${name}" is already exists`);
      }

      // Add the method name to the list of existing method names
      this.existsMethodNames.push(name);

      // Dynamically create the method and assign it to the methods object
      methods[name] = () => {
        try {
          // Make an HTTP request using the Axios client with the provided configuration
          return this.client.request({
            url: config.url, // The URL for the request
            method: method, // The HTTP method (e.g., GET, POST)
            ...config, // Spread the remaining configuration properties
          });
        } catch (error) {
          // Rethrow any errors encountered during the request
          throw error;
        }
      };
    });

    // Return the generated methods object
    return methods;
  }
}

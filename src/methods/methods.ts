import { AxiosInstance, AxiosResponse } from "axios";
import { MethodConstructor } from "./methodConstructor";
import { IMethods, IMethodsRequestConfig } from "../interfaces/methods";

/**
 * The `Methods` class provides a set of HTTP methods (GET, POST, PUT, DELETE, PATCH, HEAD)
 * for interacting with RESTful APIs using an Axios client instance. It extends the 
 * `MethodConstructor` class and implements the `IMethods` interface, ensuring a consistent 
 * structure for HTTP requests.
 *
 * This class is designed to simplify the process of making HTTP requests by encapsulating 
 * the logic for each HTTP method. Each method returns a Promise that resolves to an 
 * `AxiosResponse` object, allowing for easy handling of API responses.
 * 
 * @class Methods
 */
export class Methods extends MethodConstructor implements IMethods {
  /**
   * Constructor for the Methods class.
   * @param client - An AxiosInstance used to make HTTP requests.
   */
  constructor(client: AxiosInstance) {
    super(client); // Call the parent class constructor with the Axios client instance.
  }

  /**
   * Sends a GET request to the specified URL.
   * @param url - The endpoint to send the GET request to.
   * @param config - Optional configuration for the request.
   * @returns A Promise resolving to the AxiosResponse object.
   */
  public async get(
    url: string,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    // Perform a GET request using Axios and return the response.
    return await this.client.get(url, config);
  }

  /**
   * Sends a POST request to the specified URL with optional data.
   * @param url - The endpoint to send the POST request to.
   * @param data - Optional data to include in the request body.
   * @param config - Optional configuration for the request.
   * @returns A Promise resolving to the AxiosResponse object.
   */
  public async post(
    url: string,
    data?: any,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    // Perform a POST request using Axios and return the response.
    return await this.client.post(url, data, config);
  }

  /**
   * Sends a PUT request to the specified URL with optional data.
   * @param url - The endpoint to send the PUT request to.
   * @param data - Optional data to include in the request body.
   * @param config - Optional configuration for the request.
   * @returns A Promise resolving to the AxiosResponse object.
   */
  public async put(
    url: string,
    data?: any,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    // Perform a PUT request using Axios and return the response.
    return await this.client.put(url, data, config);
  }

  /**
   * Sends a DELETE request to the specified URL with optional data.
   * @param url - The endpoint to send the DELETE request to.
   * @param data - Optional data to include in the request body.
   * @returns A Promise resolving to the AxiosResponse object.
   */
  public async delete(url: string, data?: any): Promise<AxiosResponse> {
    // Perform a DELETE request using Axios and return the response.
    return await this.client.delete(url, data);
  }

  /**
   * Sends a PATCH request to the specified URL with optional data.
   * @param url - The endpoint to send the PATCH request to.
   * @param data - Optional data to include in the request body.
   * @param config - Optional configuration for the request.
   * @returns A Promise resolving to the AxiosResponse object.
   */
  public async patch(
    url: string,
    data?: any,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    // Perform a PATCH request using Axios and return the response.
    return await this.client.patch(url, data, config);
  }

  /**
   * Sends a HEAD request to the specified URL with optional data.
   * @param url - The endpoint to send the HEAD request to.
   * @param data - Optional data to include in the request body.
   * @returns A Promise resolving to the AxiosResponse object.
   */
  public async head(url: string, data?: any): Promise<AxiosResponse> {
    // Perform a HEAD request using Axios and return the response.
    return await this.client.head(url, data);
  }
}

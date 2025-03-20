import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { GeneratedMethods, RequestConfig } from "../interfaces/methods";

export class MethodGenerator {
  private client: AxiosInstance;
  private methodsConfig: RequestConfig[] = [];
  private existsMethodNames: string[] = [];

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  /**
   * Binds the methods configuration to the generator
   * 
   * @param methodsConfig {RequestConfig[]} - The configuration of the methods
   */
  public bind(methodsConfig: RequestConfig[]): void {
    this.methodsConfig = methodsConfig;
  }

  /**
   * Generates and returns the methods based on specified configurations simultaneously
   */
  public getMethods(): GeneratedMethods<typeof this.methodsConfig> {
    const methods: GeneratedMethods<typeof this.methodsConfig> = {} as GeneratedMethods<typeof this.methodsConfig>;

    this.methodsConfig.forEach((config) => {
      const name = config.methodName;
      const method = config.method;

      if (!method) {
        throw new Error(`HTTP method for "${name}" cannot be empty or null.`);
      }

      if (this.existsMethodNames.length !== 0 && this.existsMethodNames.includes(name)) {
        throw new Error(`Method name "${name}" is already exists`);
      }

      this.existsMethodNames.push(name);
      methods[name] = () => {
        try {
          return this.client.request({
            url: config.url,
            method: method,
            ...config,
          });
        } catch (error) {
          throw error;
        }
      };
    });

    return methods;
  }
}

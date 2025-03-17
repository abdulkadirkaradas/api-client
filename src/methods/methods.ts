import { AxiosInstance, AxiosResponse } from "axios";
import { MethodConstructor } from "./methodConstructor";
import { IMethods, IMethodsRequestConfig } from "../interfaces/methods";

export class Methods extends MethodConstructor implements IMethods {
  constructor(client: AxiosInstance) {
    super(client);
  }

  public async get(
    url: string,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    return await this.client.get(url, config);
  }

  public async post(
    url: string,
    data?: any,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    return await this.client.post(url, data, config);
  }

  public async put(
    url: string,
    data?: any,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    return await this.client.put(url, data, config);
  }

  public async delete(url: string, data?: any): Promise<AxiosResponse> {
    return await this.client.delete(url, data);
  }

  public async patch(
    url: string,
    data?: any,
    config?: IMethodsRequestConfig
  ): Promise<AxiosResponse> {
    return await this.client.patch(url, data, config);
  }

  public async head(url: string, data?: any): Promise<AxiosResponse> {
    return await this.client.head(url, data);
  }
}

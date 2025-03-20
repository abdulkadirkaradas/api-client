import { AxiosRequestConfig, AxiosResponse } from "axios";

export type IMethodsRequestConfig = Omit<AxiosRequestConfig, "url" | "data">;

export interface IMethods {
    get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    delete(url: string, data?: any): Promise<AxiosResponse>;
    patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    head(url: string, data?: any): Promise<AxiosResponse>;
};

export interface RequestConfig extends AxiosRequestConfig {
  methodName: string;
}

export type GeneratedMethods<T extends { methodName: string }[]> = {
  [K in T[number]['methodName']]: () => Promise<AxiosResponse>;
};
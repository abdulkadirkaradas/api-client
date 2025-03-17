import { AxiosRequestConfig, AxiosResponse } from "axios";

export interface IMethods {
    get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    post(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    put(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    delete(url: string, data?: any): Promise<AxiosResponse>;
    patch(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse>;
    head(url: string, data?: any): Promise<AxiosResponse>;
};
import { AxiosInstance } from "axios";
import { AuthorizationTokenConfig } from "./auth";
import { StorageType } from "./storage";

export interface IServiceConstructor {
    client: AxiosInstance;
    tokenConfig?: AuthorizationTokenConfig;
}
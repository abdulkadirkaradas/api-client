import { AxiosRequestConfig } from "axios";
import { AuthorizationTokenConfig } from "./auth";

export interface APIClientConfig extends AxiosRequestConfig {
    token?: {
        accessToken: string | null;
        refreshToken: string | null;
    };
    tokenConfig?: AuthorizationTokenConfig | null;
}
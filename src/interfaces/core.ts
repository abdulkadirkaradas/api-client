import { AxiosRequestConfig } from "axios";
import { AuthorizationTokenConfig, AuthProtocolConfig } from "./auth";
import { ResponseTokenRefreshConfig } from "./interceptors";

export interface APIClientConfig extends AxiosRequestConfig {
    authProtocol?: AuthProtocolConfig;
    tokenConfig?: AuthorizationTokenConfig;
    interceptor?: {
        response?: {
            tokenRefreshConfig?: ResponseTokenRefreshConfig;
        }
    }
}
import { AxiosRequestConfig } from "axios";
import { AuthorizationTokenConfig } from "./auth";

export type AuthProtocolConfig = {
    useAuthProtocol: boolean,
    useOAUTHProtocol?: boolean
}

export interface APIClientConfig extends AxiosRequestConfig {
    authProtocol: AuthProtocolConfig;
    token?: {
        accessToken: string | null;
        refreshToken: string | null;
    };
    tokenConfig?: AuthorizationTokenConfig | null;
}
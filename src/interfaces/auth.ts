import { StorageType } from "./storage";

export interface AuthorizationTokenConfig {
    requestTokenConfig?: {
        accessTokenName?: string | null;
        refreshTokenName?: string | null;
    };
    tokenStorageType?: {
        accessToken?: StorageType | null;
        refreshToken?: StorageType | null;
    }
}
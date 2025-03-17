import { APIClient } from "./core/apiClient";
import { APIClientConfig } from "./interfaces/core";

export const createAPIClient = (config: APIClientConfig) => {
    return new APIClient(config);
};
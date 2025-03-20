import { APIClient } from "./core/apiClient";
import { ClientServices } from "./core/services/client/clientService";
import { APIClientConfig } from "./interfaces/core";
import { ClientStorageFactory } from "./utils/storage/client/storageFactory";
import { MethodGenerator as Generator } from './methods/generator';

export const createAPIClient = (config: APIClientConfig) => {
  const ApiClient = new APIClient(config);
  const MethodGenerator = new Generator(ApiClient.getInstance());
  const Services = {
    client: new ClientServices({
      client: ApiClient.getInstance(),
      tokenConfig: config.tokenConfig || {},
    }),
  };
  const Storage = {
    client: new ClientStorageFactory(),
  };

  return {
    ApiClient,
    MethodGenerator,
    Services,
    Storage,
  };
};

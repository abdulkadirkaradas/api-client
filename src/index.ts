import { APIClient } from "./core/apiClient";
import { ClientServices } from "./core/services/client/clientService";
import { APIClientConfig } from "./interfaces/core";
import { ClientStorageFactory } from "./utils/storage/client/storageFactory";
import { MethodGenerator as Generator } from './methods/generator';
import { EventBus as EventBusClass } from './utils/eventBus/EventBus';

export const moodo = (config: APIClientConfig) => {
  const ApiClient = new APIClient(config);
  const EventBus = new EventBusClass();
  const MethodGenerator = new Generator(ApiClient.getInstance());
  const Services = {
    client: new ClientServices({
      client: ApiClient.getInstance(),
      eventBus: ApiClient.getEventBusInstance(),
      authProtocol: ApiClient.getAuthProtocolConfig(),
      tokenConfig: config.tokenConfig || {},
    }),
  };
  const Storage = {
    client: new ClientStorageFactory(),
  };

  return {
    ApiClient,
    EventBus,
    MethodGenerator,
    Services,
    Storage,
  };
};

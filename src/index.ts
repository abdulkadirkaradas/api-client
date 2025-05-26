import { APIClient } from "./core/apiClient";
import { ClientServices } from "./core/services/client/clientService";
import { APIClientConfig } from "./interfaces/core";
import { StorageFactory as BaseStorageFactory } from "./utils/storage/storageFactory";
import { MethodGenerator as Generator } from './methods/generator';
import { EventBus as EventBusClass } from './utils/eventBus/EventBus';

const moodo = (config: APIClientConfig) => {
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
  const StorageFactory = new BaseStorageFactory();

  return {
    ApiClient,
    EventBus,
    MethodGenerator,
    Services,
    StorageFactory,
  };
};

export default moodo;
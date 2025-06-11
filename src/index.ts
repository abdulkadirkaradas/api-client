import { APIClient } from "./core/apiClient";
import { APIClientConfig } from "./interfaces/core";
import { StorageFactory as BaseStorageFactory } from "./utils/storage/storageFactory";
import { MethodGenerator as Generator } from "./methods/generator";
import { EventBus as EventBusClass } from "./utils/eventBus/EventBus";
import { RedisService } from "./core/services/server/redisService";
import { AuthorizationService } from "./core/services/client/authorization";

const moodo = (config: APIClientConfig) => {
  const ApiClient = new APIClient(config);
  const authProtocolConfig = ApiClient.getAuthProtocolConfig();

  const EventBus = new EventBusClass();
  const MethodGenerator = new Generator(ApiClient.getInstance());
  const Services = {
    authorization: new AuthorizationService({
      client: ApiClient.getInstance(),
      eventBus: ApiClient.getEventBusInstance(),
      authProtocol: {
        useAuthProtocol: authProtocolConfig?.useAuthProtocol || true,
        useOAUTHProtocol: authProtocolConfig?.useOAUTHProtocol || false,
      },
      tokenConfig: config.tokenConfig || {},
    }),
    redis: new RedisService(),
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

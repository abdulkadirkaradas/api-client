import MockAdapter from "axios-mock-adapter";
import moodo from "../../src/index";
import { APIClient } from "../../src/core/apiClient";
import { APIClientConfig } from "../../src/interfaces/core";
import { EventBus } from "../../src/utils/eventBus/EventBus";
import { MethodGenerator } from "../../src/methods/generator";
import { StorageFactory } from "../../src/utils/storage/storageFactory";
import { RedisService } from "../../src/core/services/server/redisService";
import { AuthorizationService } from "../../src/core/services/client/authorization";

export class TestSetup {
  public config: APIClientConfig;
  public mock: MockAdapter;
  public instance: APIClient;
  public eventBus: EventBus;
  public storage: StorageFactory;
  public authService: AuthorizationService;
  public redisService: RedisService;
  public methodGenerator: MethodGenerator;

  constructor() {
    this.config = {
      authProtocol: {
        useOAUTHProtocol: true,
      },
      baseURL: "https://api.example.com",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const create = moodo(this.config);
    this.instance = create.ApiClient;
    this.eventBus = create.EventBus;
    this.methodGenerator = create.MethodGenerator;
    this.authService = create.Services.authorization;
    this.redisService = create.Services.redis;
    this.storage = create.StorageFactory;
    this.mock = new MockAdapter(this.instance.getInstance());
  }

  public setConfig(config: Omit<APIClientConfig, "baseURL">) {
    this.config = config;
  }
}

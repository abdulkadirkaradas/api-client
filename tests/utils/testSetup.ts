import MockAdapter from 'axios-mock-adapter';
import { APIClient } from '../../src/core/apiClient';
import { APIClientConfig } from '../../src/interfaces/core';
import { ClientServices } from '../../src/core/services/client/clientService';
import { ClientStorageFactory } from '../../src/utils/storage/client/storageFactory';
import { createAPIClient } from '../../src/index';
import { EventBus } from '../../src/utils/eventBus/EventBus';
import { MethodGenerator } from '../../src/methods/generator';

export class TestSetup {
  public config: APIClientConfig;
  public mock: MockAdapter;
  public instance: APIClient;
  public eventBus: EventBus;
  public clientStorage: ClientStorageFactory;
  public clientService: ClientServices;
  public methodGenerator: MethodGenerator;

  constructor() {
    this.config = {
      authProtocol: {
        useAuthProtocol: true,
        useOAUTHProtocol: true,
      },
      baseURL: "https://api.example.com",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const create = createAPIClient(this.config);
    this.instance = create.ApiClient;
    this.eventBus = create.EventBus;
    this.methodGenerator = create.MethodGenerator;
    this.clientService = create.Services.client;
    this.clientStorage = create.Storage.client;
    this.mock = new MockAdapter(this.instance.getInstance());
  }

  public setConfig(config: Omit<APIClientConfig, "baseURL">) {
    this.config = config;
  }
}

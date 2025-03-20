import MockAdapter from "axios-mock-adapter";
import { APIClient } from "../../src/core/apiClient";
import { APIClientConfig } from "../../src/interfaces/core";
import { createAPIClient } from "../../src/index";
import { ClientStorageFactory } from "../../src/utils/storage/client/storageFactory";
import { ClientServices } from "../../src/core/services/client/clientService";
import { MethodGenerator } from "../../src/methods/generator";

export class TestSetup {
  public config: APIClientConfig;
  public mock: MockAdapter;
  public instance: APIClient;
  public clientStorage: ClientStorageFactory;
  public clientService: ClientServices;
  public methodGenerator: MethodGenerator;

  constructor() {
    this.config = {
      baseURL: "https://api.escuelajs.co/api/v1",
      headers: {
        "Content-Type": "application/json",
      },
      tokenConfig: {
        requestTokenConfig: {
          accessTokenName: "access_token",
          refreshTokenName: "refresh_token",
        },
      },
    };

    const create = createAPIClient(this.config);
    this.instance = create.ApiClient;
    this.methodGenerator = create.MethodGenerator;
    this.clientService = create.Services.client;
    this.clientStorage = create.Storage.client;
    this.mock = new MockAdapter(this.instance.getInstance());
  }

  public setConfig(config: Omit<APIClientConfig, "baseURL">) {
    this.config = config;
  }
}

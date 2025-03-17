import MockAdapter from 'axios-mock-adapter';
import { APIClient } from '../../src/core/apiClient';
import { APIClientConfig } from '../../src/interfaces/core';
import { createAPIClient } from '../../src/index';

export class TestSetup {
  public config: APIClientConfig;
  public mock: MockAdapter;
  public instance: APIClient;

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
        tokenStorageType: {
          accessToken: "localStorage",
          refreshToken: "localStorage",
        },
      },
    };

    this.instance = createAPIClient(this.config);
    this.mock = new MockAdapter(this.instance.getInstance());
  }

  public setConfig(config: Omit<APIClientConfig, "baseURL">) {
    this.config = config;
  }
}

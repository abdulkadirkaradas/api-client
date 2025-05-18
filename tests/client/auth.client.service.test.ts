import "jest-localstorage-mock";
import { TestSetup } from "../utils/testSetup";
import {
  AuthorizationServiceConfig,
  AuthorizationTokenConfig,
} from "../../src/interfaces/auth";
import { IStorage } from "../../src/interfaces/storage";

describe("API Client Autorization Service", () => {
  let setup: TestSetup;
  let storage: IStorage | any;

  beforeEach(() => {
    setup = new TestSetup();
    localStorage.clear();
    jest.clearAllMocks();

    setup.clientService.auth.setTokenConfig({
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
      requestTokenConfig: {
        accessTokenName: "access_token",
        refreshTokenName: "refresh_token",
      },
    });

    storage = setup.clientService.createStorages({
      localStorage: {
        type: "localStorage"
      }
    }).localStorage;
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it("should set token configuration correctly", () => {
    let tokenConfig: AuthorizationTokenConfig = {
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
    };

    setup.clientService.auth.setTokenConfig(tokenConfig);

    expect(setup.clientService.auth.getTokenConfig()).toMatchObject(tokenConfig);
  });

  it("should handle user registration service successfully", () => {
    let registerStub: {} = {
      id: 1,
      email: "string",
      password: "string",
      name: "string",
      avatar: "string",
      role: "string",
    };

    let config: AuthorizationServiceConfig = {
      url: "/users/",
      data: {
        name: "Nicolas",
        email: "nico@gmail.com",
        password: "1234",
        avatar: "https://picsum.photos/800",
      },
    };

    setup.mock.onPost(config.url).reply(200, registerStub);

    setup.clientService.auth
      .register(config)
      .then(function (result) {
        expect(result.data.id).toBe(1);
        expect(result.data.email).toBe("string");
        expect(result.data.password).toBe("string");
        expect(result.data.name).toBe("string");
        expect(result.data.avatar).toBe("string");
        expect(result.data.role).toBe("string");
        // console.log(result.data);
      });
  });

  it("should handle user login service successfully", () => {
    let loginStub: {} = {
      access_token: "string",
      refresh_token: "string",
    };

    let config: AuthorizationServiceConfig = {
      url: "/auth/login",
      data: {
        email: "usr@mail.com",
        password: "pwd",
      },
    };

    setup.mock.onPost(config.url).reply(200, loginStub);

    setup.clientService.auth
      .login(config)
      .then(function (result) {
        expect(storage.get("accessToken")).toBe(result.data.access_token);
        expect(storage.get("refreshToken")).toBe(result.data.refresh_token);
        // console.log(result.data);
      });
  });

  it("should handle refresh token service successfully", () => {
    let resfreshTokenStub: Object = {
      access_token: "string",
      refresh_token: "string",
    };

    let config: AuthorizationServiceConfig = {
      url: "/auth/refresh-token",
      data: {
        refreshToken: "string",
      },
    };

    setup.mock.onPost(config.url).reply(200, resfreshTokenStub);

    setup.clientService.auth
      .refreshToken(config)
      .then(function (result) {
        expect(storage.get("accessToken")).toBe(result.data.access_token);
        expect(storage.get("refreshToken")).toBe(result.data.refresh_token);
      });
  });

  it("should handle user logout service successfully", () => {
    let config: AuthorizationServiceConfig = {
      url: "/auth/logout",
    };

    setup.mock.onPost(config.url).reply(200);

    setup.clientService.auth
      .logout(config)
      .then(function () {
        expect(storage.get("accessToken")).toBeNull();
        expect(storage.get("refreshToken")).toBeNull();
      });
  });

  it("should handle 401 error for login service", () => {
    let loginStub: Object = {
      message: "string",
      statusCode: 401,
    };

    let config: AuthorizationServiceConfig = {
      url: "/auth/login",
      data: {
        refreshToken: "invalid_token",
      },
    };

    setup.mock.onPost(config.url).reply(401, loginStub);

    setup.clientService.auth.login(config).catch(function (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual(loginStub);
    });
  });

  it("should handle 401 error for register service", () => {
    let registerStub: Object = {
      message: "string",
      statusCode: 401,
    };

    let config: AuthorizationServiceConfig = {
      url: "/users/",
      data: {
        name: "Nicolas",
        email: "nico@gmail.com",
        password: "1234",
        avatar: "https://picsum.photos/800",
      },
    };

    setup.mock.onPost(config.url).reply(401, registerStub);

    setup.clientService.auth.register(config).catch(function (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual(registerStub);
    });
  });

  it("should handle 401 error for refresh token service", () => {
    let resfreshTokenStub: Object = {
      message: "string",
      statusCode: 401,
    };

    let config: AuthorizationServiceConfig = {
      url: "/auth/refresh-token",
      data: {
        refreshToken: "string",
      },
    };

    setup.mock.onPost(config.url).reply(401, resfreshTokenStub);

    setup.clientService.auth.refreshToken(config).catch(function (error) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual(resfreshTokenStub);
    });
  });
});

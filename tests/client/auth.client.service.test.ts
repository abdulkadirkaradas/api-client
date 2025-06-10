import "jest-localstorage-mock";
import { TestSetup } from "../utils/testSetup";
import {
  AuthorizationServiceConfig,
  AuthorizationTokenConfig,
} from "../../src/interfaces/auth";
import { IStorage } from "../../src/interfaces/storages/storage";

describe("API Client Autorization Service", () => {
  let setup: TestSetup;
  let storage: IStorage | any;

  beforeEach(() => {
    setup = new TestSetup();
    localStorage.clear();
    jest.clearAllMocks();

    setup.authService.setTokenConfig({
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
      requestTokenConfig: {
        accessTokenName: "access_token",
        refreshTokenName: "refresh_token",
      },
    });

    storage = setup.storage.createStorage("web", "localStorage");
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

    setup.authService.setTokenConfig(tokenConfig);

    expect(setup.authService.getTokenConfig()).toMatchObject(tokenConfig);
  });

  it("should handle user registration service successfully", async () => {
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

    const result = await setup.authService.register(config);
    expect(result.data.id).toBe(1);
    expect(result.data.email).toBe("string");
    expect(result.data.password).toBe("string");
    expect(result.data.name).toBe("string");
    expect(result.data.avatar).toBe("string");
    expect(result.data.role).toBe("string");
  });

  it("should handle user login service successfully", async () => {
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

    const result = await setup.authService.login(config);
    expect(storage.get("accessToken")).toBe(result.data.access_token);
    expect(storage.get("refreshToken")).toBe(result.data.refresh_token);
  });

  it("should handle refresh token service successfully", async () => {
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

    const result = await setup.authService.refreshToken(config);
    expect(storage.get("accessToken")).toBe(result.data.access_token);
    expect(storage.get("refreshToken")).toBe(result.data.refresh_token);
  });

  it("should handle user logout service successfully", async () => {
    let config: AuthorizationServiceConfig = {
      url: "/auth/logout",
    };

    setup.mock.onPost(config.url).reply(200);

    await setup.authService.logout(config);
    expect(storage.get("accessToken")).toBeNull();
    expect(storage.get("refreshToken")).toBeNull();
  });

  it("should handle 401 error for login service", async () => {
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

    try {
      await setup.authService.login(config);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual(loginStub);
    }
  });

  it("should handle 401 error for register service", async () => {
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

    try {
      await setup.authService.register(config);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual(registerStub);
    }
  });

  it("should handle 401 error for refresh token service", async () => {
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

    try {
      await setup.authService.refreshToken(config);
    } catch (error: any) {
      expect(error.response.status).toBe(401);
      expect(error.response.data).toEqual(resfreshTokenStub);
    }
  });
});

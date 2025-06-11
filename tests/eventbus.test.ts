import { TestSetup } from "./utils/testSetup";
import {
  AuthorizationServiceConfig,
  AuthorizationTokenConfig,
} from "../src/interfaces/auth";

describe("API Client EventBus", () => {
  let setup: TestSetup;
  let mockCallback1: jest.Mock;
  let mockCallback2: jest.Mock;

  beforeEach(async () => {
    setup = new TestSetup();
    mockCallback1 = jest.fn();
    mockCallback2 = jest.fn();

    jest.clearAllMocks();
  });

  afterEach(() => {
    setup.mock.restore();
  });

  // -- TEST FOR INTERCEPTOR EVENTS --
  it("should set Authorization header correctly during a request", async () => {
    let loginStub = {
      access_token: "access_token",
      refresh_token: "access_token",
    };

    await login({
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
      requestTokenConfig: {
        accessTokenName: "access_token",
        refreshTokenName: "refresh_token",
      },
    });

    setup.mock.onGet("/categories/").reply(200, {});

    const response = await setup.instance.methods.get("/categories/");

    expect(response.config.headers.Authorization).toBe(
      `Bearer ${loginStub.access_token}`
    );
  });

  it("should refresh token on 401 error and retry request", async () => {
    let successStub: Object = { success: true };
    let config: AuthorizationServiceConfig = {
      url: "/auth/refresh-token",
      data: {
        refreshToken: "string",
      },
    };
    let mockUrl = "/auth/profile";

    setup.instance.interceptorService.response.setTokenRefreshConfig({
      url: config.url,
    });

    await login({
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
      requestTokenConfig: {
        accessTokenName: "access_token",
        refreshTokenName: "refresh_token",
      },
    });

    setup.mock.onGet(mockUrl).replyOnce(401);

    setup.mock.onPost(config.url).reply(200, {
      refresh_token: "refresh_token",
      access_token: "access_token",
    });

    setup.mock.onGet(mockUrl).replyOnce(200, successStub);

    const response = await setup.instance.methods.get(mockUrl);

    expect(response.data).toEqual(successStub);
  });

  async function login(tokenConfig: AuthorizationTokenConfig = {}) {
    let loginStub: {} = {
      access_token: "access_token",
      refresh_token: "refresh_token",
    };

    let config: AuthorizationServiceConfig = {
      url: "/auth/login",
      data: {
        email: "usr@mail.com",
        password: "pwd",
      },
    };

    setup.authService.setTokenConfig(tokenConfig);

    setup.mock.onPost(config.url).reply(200, loginStub);

    await setup.authService.login(config);
  }
  // -- TEST FOR INTERCEPTOR EVENTS --
  // ------------------------------------------------
  // -- TEST FOR EVENT BUS --
  it("should subscribe and emit events of different types", () => {
    setup.eventBus.subscribe("testRegular", "regular", mockCallback1);
    setup.eventBus.subscribe("testAuth", "auth", mockCallback2);

    setup.eventBus.emit("testRegular", "regular", "regularData");
    setup.eventBus.emit("testAuth", "auth", "authData");

    expect(mockCallback1).toHaveBeenCalledWith("regularData");
    expect(mockCallback2).toHaveBeenCalledWith("authData");
  });

  it("should unsubscribe a specific callback", () => {
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.subscribe("testEvent", "regular", mockCallback2);

    setup.eventBus.unsubscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.emit("testEvent", "regular", "data");

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });

  it("should execute callbacks in priority order", () => {
    const mockCallback3 = jest.fn();
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1, 1);
    setup.eventBus.subscribe("testEvent", "regular", mockCallback2, 2);
    setup.eventBus.subscribe("testEvent", "regular", mockCallback3, 0);

    setup.eventBus.emit("testEvent", "regular", "data");

    expect(mockCallback2.mock.invocationCallOrder[0]).toBeLessThan(
      mockCallback1.mock.invocationCallOrder[0]
    );
    expect(mockCallback1.mock.invocationCallOrder[0]).toBeLessThan(
      mockCallback3.mock.invocationCallOrder[0]
    );
  });

  it("should resolve dependencies before executing callbacks", () => {
    const mockDependency = jest.fn();
    setup.eventBus.subscribe("dependencyEvent", "regular", mockDependency);
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1, 0, [
      "dependencyEvent",
    ]);

    setup.eventBus.emit("testEvent", "regular", "data");

    expect(mockDependency).toHaveBeenCalled();
    expect(mockCallback1).toHaveBeenCalled();
    expect(mockDependency.mock.invocationCallOrder[0]).toBeLessThan(
      mockCallback1.mock.invocationCallOrder[0]
    );
  });

  it("should not execute callbacks if dependencies are not met", () => {
    const mockDependency = jest.fn();
    setup.eventBus.subscribe("dependencyEvent", "regular", mockDependency);
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1, 0, [
      "nonExistentDependency",
    ]);

    setup.eventBus.emit("testEvent", "regular", "data");

    expect(mockCallback1).not.toHaveBeenCalled();
  });

  it("should clear all events for a specific event name and type", () => {
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.clear("regular", "testEvent");

    setup.eventBus.emit("testEvent", "regular", "data");
    expect(mockCallback1).not.toHaveBeenCalled();
  });

  it("should clear all events for a specific type", () => {
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.subscribe("testAuth", "auth", mockCallback2);
    setup.eventBus.clearType("regular");

    setup.eventBus.emit("testEvent", "regular", "data");
    setup.eventBus.emit("testAuth", "auth", "data");

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });

  it("should clear all events for all types", () => {
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.subscribe("testAuth", "auth", mockCallback2);
    setup.eventBus.clearAll();

    setup.eventBus.emit("testEvent", "regular", "data");
    setup.eventBus.emit("testAuth", "auth", "data");

    expect(mockCallback1).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();
  });

  it("should handle events without dependencies", () => {
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.emit("testEvent", "regular", "data");
    expect(mockCallback1).toHaveBeenCalled();
  });

  it("should handle multiple callbacks for the same event and type", () => {
    setup.eventBus.subscribe("testEvent", "regular", mockCallback1);
    setup.eventBus.subscribe("testEvent", "regular", mockCallback2);

    setup.eventBus.emit("testEvent", "regular", "data");

    expect(mockCallback1).toHaveBeenCalled();
    expect(mockCallback2).toHaveBeenCalled();
  });
  // -- TEST FOR EVENT BUS --
});

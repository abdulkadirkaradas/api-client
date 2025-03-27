import "jest-localstorage-mock";
import { TestSetup } from "./utils/testSetup";
import { AuthorizationServiceConfig } from "../src/interfaces/auth";
import { AxiosError } from "axios";

describe("API Client EventBus", () => {
  let setup: TestSetup;

  jest.setTimeout(15000);

  beforeEach(async () => {
    setup = new TestSetup();
    localStorage.clear();
    jest.clearAllMocks();

    setup.clientService.auth.setTokenConfig({
      requestTokenConfig: {
        accessTokenName: "access_token",
        refreshTokenName: "refresh_token",
      },
    });
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it("should set Authorization header correctly during a request", async () => {
    let loginStub = {
      access_token: "string",
      refresh_token: "string",
    };

    await login();

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

    await login();

    setup.mock.onGet(mockUrl).replyOnce(401);

    setup.mock.onPost(config.url).reply(200, { refresh_token: "refresh_token", access_token: "access_token" });

    setup.mock.onGet(mockUrl).replyOnce(200, successStub);

    const response = await setup.instance.methods.get(mockUrl);

    expect(response.data).toEqual(successStub);
  });

  async function login() {
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

    setup.clientService.auth.setTokenConfig({
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
    });

    setup.mock.onPost(config.url).reply(200, loginStub);

    await setup.clientService.auth.login(config);
  }

  it("should retry on 500 error and succeed on second attempt", async () => {
    setup.mock
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .reply(200, { success: true });

    const response = await setup.instance.methods.get("/retry-test");

    expect(response.data).toEqual({ success: true });
  });

  it("should throw error after max retries on 500 error", async () => {
    setup.mock.onGet("/retry-fail").reply(500);

    try {
      await setup.instance.methods.get("/retry-fail");
    } catch (error: AxiosError | any) {
      expect(error).toBeDefined();
      expect(error.message).toContain("Request failed with status code 500");
    }
  });
});

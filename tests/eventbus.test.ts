import "jest-localstorage-mock";
import { TestSetup } from "./utils/testSetup";
import { AuthorizationServiceConfig } from "../src/interfaces/auth";
import { AxiosError } from "axios";

describe("API Client EventBus", () => {
  let setup: TestSetup;

  jest.setTimeout(15000);

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
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it("should set Authorization header correctly during a request", async () => {
    let loginStub = {
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

    // Set mock API response for login
    setup.mock.onPost(config.url).reply(200, loginStub);

    // Perform login request
    await setup.clientService.auth.login(config);

    // Mock a GET request and verify Authorization header
    setup.mock.onGet("/categories/").reply(200, {});

    // Perform the GET request
    const response = await setup.instance.methods.get("/categories/");

    // Check if Authorization header is set correctly
    expect(response.config.headers.Authorization).toBe(
      `Bearer ${loginStub.access_token}`
    );
  });

  it("should refresh token on 401 error and retry request", async () => {
    let successStub: Object = {
      id: 1,
      email: "string",
      password: "string",
      name: "string",
      role: "string",
      avatar: "string",
    };
    let config: AuthorizationServiceConfig = {
      url: "/auth/refresh-token",
      data: {
        refreshToken: "string",
      },
    };
    let mockUrl = "/auth/profile";

    setup.mock.onGet(mockUrl).replyOnce(401);

    setup.mock.onPost(config.url).reply(200, {
      refresh_token: "string",
    });

    setup.mock.onGet(mockUrl).replyOnce(200, successStub);

    setup.instance.interceptorService.response.setRefreshTokenEventConfig({
      url: config.url,
    });

    await login();

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

    setup.mock.onPost(config.url).reply(200, loginStub);

    await setup.clientService.auth.login(config);
  }

  it("should retry on 500 error and succeed on second attempt", async () => {
    // İlk iki istekte 500 hatası döndür, üçüncüde 200 başarılı yanıt ver
    setup.mock
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .replyOnce(500)
      .onGet("/retry-test")
      .reply(200, { success: true });

    // API çağrısını başlat
    const response = await setup.instance.methods.get("/retry-test");

    // Beklenen sonuç: İlk iki deneme başarısız, üçüncü denemede başarılı
    expect(response.data).toEqual({ success: true });
  });

  it("should throw error after max retries on 500 error", async () => {
    // 500 hatası döndürmeye devam et (maksimum deneme sayısını aşsın)
    setup.mock.onGet("/retry-fail").reply(500);

    try {
      await setup.instance.methods.get("/retry-fail");
    } catch (error: AxiosError | any) {
      console.error(error);
      expect(error).toBeDefined();
      expect(error.message).toContain("Request failed with status code 500");
    }
  });
});

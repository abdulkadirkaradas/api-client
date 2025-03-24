import "jest-localstorage-mock";
import { TestSetup } from "./utils/testSetup";
import { AuthorizationServiceConfig } from "../src/interfaces/auth";

describe("API Client EventBus", () => {
  let setup: TestSetup;

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
  
    // Set mock API response
    setup.mock.onPost(config.url).reply(200, loginStub);
  
    // Await login request
    await setup.clientService.auth.login(config);
  
    // Create a mock GET request and check Authorization header
    setup.mock.onGet("/categories/").reply((request) => {
      // check Authorization header
      expect(request.headers?.Authorization).toBe(`Bearer ${loginStub.access_token}`);
      return [200, {}];
    });
  
    // Send GET request
    await setup.instance.methods.get("/test-endpoint");
  });
});

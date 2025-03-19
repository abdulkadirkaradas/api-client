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
      }
    });

    setup.clientService.setStorageType({
      sessionStorage: "localStorage",
    });
    storage = setup.clientService.getStorage("localStorage");
  });

  it("Is token config set", () => {
    let tokenConfig: AuthorizationTokenConfig = {
      tokenStorageType: {
        accessToken: "localStorage",
        refreshToken: "localStorage",
      },
    };

    setup.clientService.auth.setTokenConfig(tokenConfig);

    expect(setup.clientService.auth.getTokenConfig()).toBe(tokenConfig);
  });

  it("Is register service works", () => {
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

    setup.mock.onPost("/users/").reply(200, registerStub);

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
      })
      .catch(function (result) {
        console.error(result);
      });
  });

  it("Is login service works", () => {
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

    setup.mock.onPost("/auth/login").reply(200, loginStub);

    setup.clientService.auth
      .login(config)
      .then(function (result) {
        expect(storage?.get("accessToken")).toBe(result.data.access_token);
        expect(storage?.get("refreshToken")).toBe(result.data.refresh_token);
        // console.log(result.data);
      })
      .catch(function (result) {
        console.error(result);
      });
  });

  //TODO logout function structure will be refactored
  // it('Is logout service works', () => {});

  it("Is refresh token service works", () => {
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
      .refreshToken(config, true)
      .then(function (result) {
        expect(storage?.get("accessToken")).toBe(result.data.access_token);
        expect(storage?.get("refreshToken")).toBe(result.data.refresh_token);
      })
      .catch(function (result) {
        console.error(result);
      });
  });
});

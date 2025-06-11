import { TestSetup } from "../../utils/testSetup";
import { AuthorizationServiceConfig } from "../../../src/interfaces/auth";
import { IStorage } from "../../../src/interfaces/storages/storage";

describe("API Client Storage/LocalStorage service", () => {
  let setup: TestSetup;
  let storage: IStorage | any;

  beforeEach(() => {
    setup = new TestSetup();
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
    storage.clear();
  });

  it("should store tokens in localStorage after login", () => {
    let config: AuthorizationServiceConfig = {
      url: "/auth/login",
      data: {
        email: "usr@mail.com",
        password: "pwd",
      },
    };

    setup.mock.onPost(config.url).reply(200, {
      access_token: "string",
      refresh_token: "string",
    });

    setup.authService
      .login(config)
      .then(function (result) {
        expect(storage.get("accessToken")).toBe(result.data.access_token);
        expect(storage.get("refreshToken")).toBe(result.data.refresh_token);
      });
  });

  it("should retrieve stored items from localStorage", () => {
    setTestValues();

    expect(storage.get("testItem")).toBe("test");
  });

  it("should remove a specific item from localStorage", () => {
    setTestValues();

    storage.remove("testItem");

    expect(storage.get("testItem")).toBeNull();
  });

  it("should clear all items from localStorage", () => {
    setTestValues();

    storage.clear();

    expect(storage.get("testItem")).toBeNull();
  });

  function setTestValues() {
    storage.clear();

    storage.set("testItem", "test");
  }
});

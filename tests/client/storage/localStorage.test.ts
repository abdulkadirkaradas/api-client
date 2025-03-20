import "jest-localstorage-mock";
import { TestSetup } from "../../utils/testSetup";
import { AuthorizationServiceConfig } from "../../../src/interfaces/auth";
import { IStorage } from "../../../src/interfaces/storage";

describe("API Client Storage/LocalStorage servie", () => {
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
    });

    setup.clientService.setStorageType({
      localStorage: "localStorage",
    });
    storage = setup.clientService.getStorage("localStorage");
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

    setup.clientService.auth
      .login(config)
      .then(function (result) {
        expect(storage?.get("accessToken")).toBe(result.data.access_token);
        expect(storage?.get("refreshToken")).toBe(result.data.refresh_token);
      })
      .catch(function (result) {
        console.error(result);
      });
  });

  it("should retrieve stored items from localStorage", () => {
    setTestValues();

    expect(storage?.get("testItem")).toBe("test");
  });

  it("should remove a specific item from localStorage", () => {
    setTestValues();

    storage?.remove("testItem");

    expect(storage?.get("testItem")).toBeNull();
  });

  it("should clear all items from localStorage", () => {
    setTestValues();

    storage?.clear();

    expect(storage?.get("testItem")).toBeNull();
  });

  function setTestValues() {
    storage?.clear();

    storage?.set("testItem", "test");
  }
});

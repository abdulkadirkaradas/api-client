// This test file is the deprecated.

import "jest-localstorage-mock";
import { TestSetup } from "../../utils/testSetup";
import { AuthorizationServiceConfig } from "../../../src/interfaces/auth";
import { IStorage } from "../../../src/interfaces/storage";

describe("API Client Storage/SessionStorage servie", () => {
  let setup: TestSetup;
  let storage: IStorage | any;

  beforeEach(() => {
    setup = new TestSetup();
    sessionStorage.clear();
    jest.clearAllMocks();

    setup.clientService.auth.setTokenConfig({
      tokenStorageType: {
        accessToken: "sessionStorage",
        refreshToken: "sessionStorage",
      },
    });

    setup.clientService.setStorageType({
      sessionStorage: "sessionStorage",
    });
    storage = setup.clientService.getStorage("sessionStorage");
  });

  it("is SET function works", () => {
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

  it("Is GET function works", () => {
    setTestValues();

    expect(storage?.get("testItem")).toBe("test");
  });

  it("Is REMOVE function works", () => {
    setTestValues();

    storage?.remove("testItem");

    expect(storage?.get("testItem")).toBeNull();
  });

  it("Is CLEAR function works", () => {
    setTestValues();

    storage?.clear();

    expect(storage?.get("testItem")).toBeNull();
  });

  function setTestValues() {
    storage?.clear();

    storage?.set("testItem", "test");
  }
});

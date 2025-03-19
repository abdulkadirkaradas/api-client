// This test file is the deprecated.

import "jest-localstorage-mock";
import { TestSetup } from "../../utils/testSetup";
import { AuthorizationServiceConfig } from "../../../src/interfaces/auth";
import { IStorage } from "../../../src/interfaces/storage";

describe("API Client Storage/CookieStorage servie", () => {
  let setup: TestSetup;
  let storage: IStorage | any;

  beforeEach(() => {
    setup = new TestSetup();
    localStorage.clear();
    jest.clearAllMocks();

    setup.clientService.setStorageType({
      cookie: "cookie",
    });
    storage = setup.clientService.getStorage("cookie");
  });

  it("is SET function works", () => {
    let testValue = "test value is set";

    storage?.set("testItem", testValue);
    expect(storage?.get("testItem")).toBe(testValue);
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

  function setTestValues() {
    storage?.clear();

    storage?.set("testItem", "test");
  }
});

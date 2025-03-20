import "jest-localstorage-mock";
import { TestSetup } from "../../utils/testSetup";
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

  it("should store a value in cookie storage", () => {
    let testValue = "test value is set";

    storage?.set("testItem", testValue);
    expect(storage?.get("testItem")).toBe(testValue);
  });

  it("should retrieve a value from cookie storage", () => {
    setTestValues();

    expect(storage?.get("testItem")).toBe("test");
  });

  it("should remove a specific value from cookie storage", () => {
    setTestValues();

    storage?.remove("testItem");

    expect(storage?.get("testItem")).toBeNull();
  });

  function setTestValues() {
    storage?.clear();

    storage?.set("testItem", "test");
  }
});

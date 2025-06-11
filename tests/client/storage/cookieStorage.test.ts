import { TestSetup } from "../../utils/testSetup";
import { IStorage } from "../../../src/interfaces/storages/storage";

describe("API Client Storage/CookieStorage service", () => {
  let setup: TestSetup;
  let storage: IStorage | any;

  beforeEach(() => {
    setup = new TestSetup();
    jest.clearAllMocks();

    storage = setup.storage.createStorage("web", "cookie");
    storage.clear();
  });

  it("should store a value in cookie storage", () => {
    let testValue = "test value is set";

    storage.set("testItem", testValue);
    expect(storage.get("testItem")).toBe(testValue);
  });

  it("should retrieve a value from cookie storage", () => {
    setTestValues();

    expect(storage.get("testItem")).toBe("test");
  });

  it("should remove a specific value from cookie storage", () => {
    setTestValues();

    storage.remove("testItem");

    expect(storage.get("testItem")).toBeNull();
  });

  function setTestValues() {
    storage.clear();

    storage.set("testItem", "test");
  }
});

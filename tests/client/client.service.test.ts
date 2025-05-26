import "jest-localstorage-mock";
import { TestSetup } from "../utils/testSetup";
import { ClientServiceStorageConfig } from "../../src/interfaces/storages/storage";
import { ClientServices } from "../../src/core/services/client/clientService";

describe("API Client Autorization Service", () => {
  let setup: TestSetup;
  let clientService: ClientServices;

  beforeEach(() => {
    setup = new TestSetup();
    localStorage.clear();
    jest.clearAllMocks();

    clientService = setup.clientService;
  });

  afterEach(() => {
    setup.mock.restore();
  });

  it("should handle single localStorage", () => {
    const storages: ClientServiceStorageConfig = {
      local: {
        type: "localStorage",
      },
    };

    let storage = clientService.createStorages(storages);
    storage.local.set("local", "test");

    expect(storage.local).toBeDefined();
    expect(storage.local.get("local")).toEqual("test");
  });

  it("should handle localStorage and sessionStorage", () => {
    const storages: ClientServiceStorageConfig = {
      local: {
        type: "localStorage",
      },
      session: {
        type: "sessionStorage",
      },
    };

    let storage = clientService.createStorages(storages);

    storage.local.set("local", "test");
    expect(storage.local).toBeDefined();
    expect(storage.local.get("local")).toEqual("test");

    storage.session.set("session", "test");
    expect(storage.session).toBeDefined();
    expect(storage.session.get("session")).toEqual("test");
  });

  it("should overwrite storage", () => {
    const storages: ClientServiceStorageConfig = {
      local: {
        type: "localStorage",
      },
    };

    const storage1 = clientService.createStorages(storages);
    storage1.local.set("local", "test");
    expect(storage1.local).toBeDefined();
    expect(storage1.local.get("local")).toEqual("test");

    const storage2 = clientService.createStorages(storages);
    storage2.local.set("local", "test2");
    expect(storage2.local).toBeDefined();
    expect(storage2.local.get("local")).toEqual("test2");
  });
});

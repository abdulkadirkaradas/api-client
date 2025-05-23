import "jest-localstorage-mock";
import { TestSetup } from "../../utils/testSetup";
import { IStorage } from "../../../src/interfaces/storage";

describe("API Client Storage/MemoryStorage service", () => {
  let setup: TestSetup;
  let storage: IStorage;

  beforeEach(() => {
    setup = new TestSetup();
    localStorage.clear();
    jest.clearAllMocks();

    storage = setup.storage.createStorage("node", "memory");
  });

  it('should set and get a value', () => {
    storage.set('foo', 'bar');
    expect(storage.get('foo')).toBe('bar');
  });

  it('should return null for non-existing key', () => {
    expect(storage.get('not-exist')).toBeNull();
  });

  it('should remove a key', () => {
    storage.set('foo', 'bar');
    storage.remove('foo');
    expect(storage.get('foo')).toBeNull();
  });

  it('should clear all data', () => {
    storage.set('a', '1');
    storage.set('b', '2');
    storage.clear();
    expect(storage.get('a')).toBeNull();
    expect(storage.get('b')).toBeNull();
  });
});

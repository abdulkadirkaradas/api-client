import { CookieStorage } from './client/cookieStorage';
import { FileStorage } from './server/fileStorage';
import { LocalStorage } from './client/localStorage';
import { MemoryStorage } from './server/memoryStorage';
import { SessionStorage } from './client/sessionStorage';
import {
  IStorage,
  NodeStorageType,
  WebStorageType,
} from "../../interfaces/storage";

type StorageType = "node" | "web";
type StorageForType<T extends StorageType> = T extends "node"
  ? NodeStorageType
  : T extends "web"
  ? WebStorageType
  : never;

/**
 * StorageFactory is a factory class for creating storage instances.
 * It provides a method to create storage objects based on the specified storage type.
 */
export class StorageFactory {
  /**
   * Creates a storage instance based on the specified storage type.
   *
   * @param type {StorageType} - The type of storage to create ("web" or "node").
   * @param storage - The specific storage type for nodejs or web.
   * @returns {IStorage} - An instance of the specified storage type.
   * @throws {Error} - Throws an error if the specified storage type is unsupported.
   */
  public createStorage<T extends StorageType>(
    type: T,
    storage: StorageForType<T>
  ): IStorage {
    const isNode = typeof process !== "undefined" && !!process.versions?.node;
    const isWeb =
      typeof window !== "undefined" && typeof window.document !== "undefined";

    if ((type === "web" && !isWeb) || (type === "node" && !isNode)) {
      throw new Error(
        `'${type}' storage is not available in this environment.`
      );
    }

    return type === "web"
      ? this.getWebStorage(storage as WebStorageType)
      : this.getNodeStorage(storage as NodeStorageType);
  }

  private getWebStorage(type: WebStorageType): IStorage { 
    switch (type) {
      case "localStorage":
        return new LocalStorage();
      case "sessionStorage":
        return new SessionStorage();
      case "cookie":
        return new CookieStorage();
      default:
        throw new Error("Unsupported web storage type");
    }
  }

  private getNodeStorage(type: NodeStorageType): IStorage {
    if (type === "memoryStorage") {
      return new MemoryStorage();
    } else if (type === "fileStorage") {
      return new FileStorage();
    }
    throw new Error("Unsupported node storage type");
  }
}

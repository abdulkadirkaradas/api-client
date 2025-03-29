import { LocalStorage } from "./localStorage";
import { SessionStorage } from "./sessionStorage";
import { CookieStorage } from "./cookieStorage";
import { IStorage, StorageType } from "../../../interfaces/storage";

/**
 * ClientStorageFactory is a factory class for creating storage instances.
 * It provides a method to create storage objects based on the specified storage type.
 */
export class ClientStorageFactory {
  /**
   * Creates a storage instance based on the specified storage type.
   * 
   * @param type {StorageType} - The type of storage to create (e.g., "localStorage", "sessionStorage", "cookie").
   * @returns {IStorage} - An instance of the specified storage type.
   * @throws {Error} - Throws an error if the specified storage type is unsupported.
   */
  public createStorage(type: StorageType): IStorage {
    switch (type) {
      case "localStorage":
        return new LocalStorage(); // Return an instance of LocalStorage for "localStorage" type.
      case "sessionStorage":
        return new SessionStorage(); // Return an instance of SessionStorage for "sessionStorage" type.
      case "cookie":
        return new CookieStorage(); // Return an instance of CookieStorage for "cookie" type.
      default:
        throw new Error("Unsupported storage type"); // Throw an error if the storage type is not recognized.
    }
  }
}

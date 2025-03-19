import { LocalStorage } from "./localStorage";
import { SessionStorage } from "./sessionStorage";
import { CookieStorage } from "./cookieStorage";
import { IStorage, StorageType } from "../../../interfaces/storage";

export class ClientStorageFactory {
  /**
   * Creates a storage instance based on the specified storage type
   * 
   * @param type 
   * @returns 
   */
  public createStorage(type: StorageType): IStorage {
    switch (type) {
      case "localStorage":
        return new LocalStorage();
      case "sessionStorage":
        return new SessionStorage();
      case "cookie":
        return new CookieStorage();
      default:
        throw new Error("Unsupported storage type");
    }
  }
}

import { StorageType } from "../../../interfaces/storage";
import { ClientStorageFactory } from "../../../utils/storage/client/storageFactory";

export class ClientStorageService {
  private storageFactory: ClientStorageFactory;
  constructor() {
    this.storageFactory = new ClientStorageFactory();
  }

  /**
   * Creates a storage based on the specified storage type
   * 
   * @param type 
   * @returns 
   */
  public createStorage(type: StorageType) {
    if (typeof window !== undefined) {
      return this.storageFactory.createStorage(type);
    }
  }
}

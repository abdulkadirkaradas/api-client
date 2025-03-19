import { AuthorizationService as WebAuthorizationService } from '../client/authorization';
import { ClientStorageService } from './storageService';
import { IServiceConstructor } from '../../../interfaces/service';
import { IStorage, StorageType } from '../../../interfaces/storage';
export class ClientServices {
  public auth: WebAuthorizationService;
  private storageService: ClientStorageService;
  private storages: Record<string, IStorage> = {};
  private storageTypes?: Record<string, StorageType> = {};
  private readonly defaultStorageType: StorageType = "localStorage";

  constructor(config: IServiceConstructor) {
    this.storageService = new ClientStorageService();
    this.auth = new WebAuthorizationService(
      config?.client,
      config?.tokenConfig || {}
    );
  }

  /**
   * Returns the specified storage.
   *
   * @param type {StorageType}
   * @returns
   */
  public getStorage(type: StorageType) {
    if (!this.storageTypes || Object.keys(this.storageTypes).length === 0) {
      throw new Error("Storage is not set");
    }

    return this.storages[type];
  }

  /**
   * Sets the storage types based on specified StorageType/s
   *
   * @param storages {Record<string, StorageType>}
   */
  public setStorageType(storages: Record<string, StorageType>) {
    this.storageTypes = storages;

    this.setStorage();
  }

  /**
   * Creates a new storage/s based on the specified type/s
   */
  private setStorage() {
    for (const type in this.storageTypes) {
      const storage = this.storageService.createStorage(
        this.storageTypes[type] || this.defaultStorageType
      );

      if (this.storages[type] !== undefined) {
        delete this.storages[type];
      }

      if (!storage) {
        throw new Error(`Failed to get storage service for type: ${type}`);
      }

      this.storages[type] = storage;
    }
  }
}

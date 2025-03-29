import { AuthorizationService as WebAuthorizationService } from '../client/authorization';
import { ClientStorageService } from './storageService';
import { IServiceConstructor } from '../../../interfaces/service';
import {
  IStorage,
  ServiceStorageCustomConfig,
  StorageCustomConfig,
  StorageType,
} from "../../../interfaces/storage";
export class ClientServices {
  public auth: WebAuthorizationService;
  private storageService: ClientStorageService;
  private storages: StorageCustomConfig = {};
  private storageTypes: ServiceStorageCustomConfig = {};
  private readonly defaultStorageType: StorageType = "localStorage";

  constructor(config: IServiceConstructor) {
    this.storageService = new ClientStorageService();
    this.auth = new WebAuthorizationService({
      client: config.client,
      eventBus: config.eventBus,
      authProtocol: config.authProtocol,
      tokenConfig: config?.tokenConfig || {},
    });
  }

  /**
   * Returns the specified storage.
   *
   * @param type {StorageType}
   * @returns
   */
  public getStorage(key: string): IStorage {
    if (
      !this.storageTypes ||
      !this.storages[key] ||
      Object.keys(this.storageTypes).length === 0
    ) {
      throw new Error("Storage is not set");
    }

    return this.storages[key] as IStorage;
  }

  /**
   * Sets the storage types based on specified StorageType/s
   *
   * @param storages {Record<string, StorageType>}
   */
  public setStorageType(storages: ServiceStorageCustomConfig) {
    this.storageTypes = { ...this.storageTypes, ...storages };

    this.createStorage();
  }

  /**
   * Creates a new storage/s based on the specified type/s
   */
  private createStorage() {
    const setStorage = (storage: StorageCustomConfig) => {
      this.storages = { ...this.storages, ...storage };
    };

    for (const key in this.storageTypes) {
      let value = this.storageTypes[key];

      const storage = this.storageService.createStorage(
        value || this.defaultStorageType
      );

      if (!storage) {
        throw new Error(`Failed to get storage service for type: ${value}`);
      }

      if (this.storages[key] !== undefined) {
        delete this.storages[key];
        delete this.storageTypes[key];
      }

      setStorage({
        [key]: storage as IStorage,
      });
    }
  }
}

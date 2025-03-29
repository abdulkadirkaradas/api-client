import { AuthorizationService as WebAuthorizationService } from '../client/authorization';
import { ClientStorageService } from './storageService';
import { IServiceConstructor } from '../../../interfaces/service';
import {
  IStorage,
  ServiceStorageCustomConfig,
  StorageCustomConfig,
  StorageType,
} from "../../../interfaces/storage";


/**
 * The `ClientServices` class is a service class used to manage authorization and storage services on the client side.
 * This class provides an instance of `WebAuthorizationService` for handling authorization and an instance of `ClientStorageService` for managing storage.
 * It also includes various methods for managing custom storage configurations and storage types.
 * 
 * @class ClientServices
 */
export class ClientServices {
  // Public instance of the AuthorizationService for handling authentication
  public auth: WebAuthorizationService;

  // Private instance of the ClientStorageService for managing storage
  private storageService: ClientStorageService;

  // Object to hold custom storage configurations
  private storages: StorageCustomConfig = {};

  // Object to map storage keys to their respective storage types
  private storageTypes: ServiceStorageCustomConfig = {};

  // Default storage type to be used if none is specified
  private readonly defaultStorageType: StorageType = "localStorage";

  /**
   * Constructor for the `ClientServices` class.
   *
   * @param config - Configuration object for initializing the services.
   */
  constructor(config: IServiceConstructor) {
    // Initialize the storage service
    this.storageService = new ClientStorageService();

    // Initialize the authorization service with the provided configuration
    this.auth = new WebAuthorizationService({
      client: config.client,
      eventBus: config.eventBus,
      authProtocol: config.authProtocol,
      tokenConfig: config?.tokenConfig || {},
    });
  }

  /**
   * Retrieves the storage instance for the specified key.
   *
   * @param key - The key identifying the storage.
   * @returns The storage instance associated with the key.
   * @throws Error if the storage is not set or the key is invalid.
   */
  public getStorage(key: string): IStorage {
    // Check if storage types or the specific storage key is not set
    if (
      !this.storageTypes ||
      !this.storages[key] ||
      Object.keys(this.storageTypes).length === 0
    ) {
      throw new Error("Storage is not set");
    }

    // Return the storage instance for the specified key
    return this.storages[key] as IStorage;
  }

  /**
   * Sets the storage types based on the specified configuration.
   *
   * @param storages - A record mapping storage keys to their respective types.
   */
  public setStorageType(storages: ServiceStorageCustomConfig) {
    this.storageTypes = { ...this.storageTypes, ...storages };
    this.createStorage();
  }

  /**
   * Creates new storage instances based on the specified types.
   * This method ensures that each storage key is associated with a valid storage instance.
   */
  private createStorage() {
    // Helper function to update the `storages` object with new storage instances.
    const setStorage = (storage: StorageCustomConfig) => {
      this.storages = { ...this.storages, ...storage };
    };

    // Iterate over each storage type configuration
    for (const key in this.storageTypes) {
      // Get the storage type for the current key
      let value = this.storageTypes[key];

      // Create a storage instance using the storage service
      const storage = this.storageService.createStorage(
        // Use the default storage type if none is specified
        value || this.defaultStorageType 
      );

      if (!storage) {
        throw new Error(`Failed to get storage service for type: ${value}`);
      }

      // If a storage instance already exists for the key, remove it
      if (this.storages[key] !== undefined) {
        // Remove the existing storage instance
        delete this.storages[key];
        // Remove the associated storage type
        delete this.storageTypes[key];
      }

      setStorage({
        [key]: storage as IStorage,
      });
    }
  }
}

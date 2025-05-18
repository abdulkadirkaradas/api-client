import { AuthorizationService as WebAuthorizationService } from "../client/authorization";
import { ClientStorageService } from "./storageService";
import { IServiceConstructor } from "../../../interfaces/service";
import {
  ClientServiceStorageConfig,
  IStorage,
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
  private storages: ClientServiceStorageConfig = {};

  // Default storage type to be used if none is specified
  private readonly defaultStorageType: StorageType = "localStorage";

  /**
   * Constructor for the `ClientServices` class.
   *
   * @param config - Configuration object for initializing the services.
   */
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
   * Create the storages based on the specified configuration.
   *
   * @param storages - An object containing the storage configurations.
   */
  public createStorages(config: ClientServiceStorageConfig) {
    this.storages = { ...this.storages, ...config };
    this.generateStorage();

    const generatedStorages: { [key: string]: IStorage } = {};
    for (const key in this.storages) {
      generatedStorages[key] = this.storages[key].storage as IStorage;
    }
    return generatedStorages;
  }

  /**
   * Creates new storage instances based on the specified types.
   * This method ensures that each storage key is associated with a valid storage instance.
   */
  private generateStorage() {
    // Helper function to update the `storages` object with new storage instances.
    const setStorage = (storage: ClientServiceStorageConfig) => {
      this.storages = { ...this.storages, ...storage };
    };

    // Iterate over each storage type configuration
    for (const key in this.storages) {
      // Get the storage type for the current key
      let property = this.storages[key];

      // Create a storage instance using the storage service
      const storage = this.storageService.createStorage(
        // Use the default storage type if none is specified
        property.type || this.defaultStorageType
      );

      if (!storage) {
        throw new Error(
          `Failed to get storage service for type: ${property.type}`
        );
      }

      // If a storage instance already exists for the key, remove it
      if (this.storages[key]) {
        // Remove the existing storage instance
        delete this.storages[key];
      }

      setStorage({
        [key]: {
          type: property.type,
          storage: storage as IStorage,
        },
      });
    }
  }
}

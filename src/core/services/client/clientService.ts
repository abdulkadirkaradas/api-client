import { AuthorizationService as WebAuthorizationService } from "../client/authorization";
import { IServiceConstructor } from "../../../interfaces/service";
import {
  ClientServiceStorageConfig,
  IStorage,
  WebStorageType,
} from "../../../interfaces/storages/storage";
import { StorageFactory } from "../../../utils/storage/storageFactory";

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
  private storageFactory: StorageFactory;

  // Object to hold custom storage configurations
  private storages: ClientServiceStorageConfig = {};

  // Default storage type to be used if none is specified
  private readonly defaultStorageType: WebStorageType = "localStorage";

  /**
   * Constructor for the `ClientServices` class.
   *
   * @param config - Configuration object for initializing the services.
   */
  constructor(config: IServiceConstructor) {
    this.storageFactory = new StorageFactory();
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
    for (const key in this.storages) {
      const property = this.storages[key];
      const storage = this.storageFactory.createStorage("web", property.type || this.defaultStorageType as WebStorageType);

      if (!storage) {
        throw new Error(
          `Failed to get storage service for type: ${property.type}`
        );
      }
      
      this.storages[key] = {
        type: property.type,
        storage: storage as IStorage,
      };
    }
  }
}

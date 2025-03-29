import { IStorage, StorageType } from "../../../interfaces/storage";
import { ClientStorageFactory } from "../../../utils/storage/client/storageFactory";

/**
 * A service class responsible for managing client-side storage operations.
 * This class utilizes a `ClientStorageFactory` to create storage instances
 * based on the specified storage type.
 * 
 * @class ClientStorageService
 * @remarks
 * This service is dependent on the `ClientStorageFactory` class to create
 * storage instances. Ensure that the `ClientStorageFactory` is properly
 * implemented and supports the required storage types.
 * 
 * @see ClientStorageFactory
 * @see StorageType
 * @see IStorage
 */
export class ClientStorageService {
  // A private instance of ClientStorageFactory used to create storage instances
  private storageFactory: ClientStorageFactory;

  /**
   * Initializes a new instance of the ClientStorageService class.
   * The constructor creates an instance of the `ClientStorageFactory` to be used
   * for creating storage instances.
   */
  constructor() {
    this.storageFactory = new ClientStorageFactory();
  }

  /**
   * Creates a storage instance based on the specified storage type.
   * This method checks if the `window` object is defined (indicating a browser environment)
   * before attempting to create the storage instance.
   * 
   * @param type - The type of storage to create (e.g., localStorage, sessionStorage).
   * @returns An instance of the storage corresponding to the specified type, or `undefined` if not in a browser environment.
   */
  public createStorage(type: StorageType): IStorage | any {
    // Ensure the code is running in a browser environment by checking if `window` is defined
    if (typeof window !== undefined) {
      // Use the storage factory to create and return the appropriate storage instance
      return this.storageFactory.createStorage(type);
    }
  }
}

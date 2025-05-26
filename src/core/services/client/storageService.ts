import { IStorage, WebStorageType } from "../../../interfaces/storages/storage";
import { StorageFactory } from "../../../utils/storage/storageFactory";

/**
 * A service class responsible for managing client-side storage operations.
 * This class utilizes a `StorageFactory` to create storage instances
 * based on the specified storage type.
 *
 * @class ClientStorageService
 * @remarks
 * This service is dependent on the `StorageFactory` class to create
 * storage instances. Ensure that the `StorageFactory` is properly
 * implemented and supports the required storage types.
 *
 * @see StorageFactory
 * @see WebStorageType
 * @see IStorage
 */
export class ClientStorageService {
  // A private instance of StorageFactory used to create storage instances
  private storageFactory: StorageFactory;

  /**
   * Initializes a new instance of the ClientStorageService class.
   * The constructor creates an instance of the `StorageFactory` to be used
   * for creating storage instances.
   */
  constructor() {
    this.storageFactory = new StorageFactory();
  }

  /**
   * Creates a storage instance based on the specified storage type.
   * This method checks if the `window` object is defined (indicating a browser environment)
   * before attempting to create the storage instance.
   *
   * @param type - The type of storage to create (e.g., localStorage, sessionStorage).
   * @returns An instance of the storage corresponding to the specified type, or `undefined` if not in a browser environment.
   */
  public createStorage(storage: WebStorageType): IStorage | any {
    return this.storageFactory.createStorage("web", storage);
  }
}

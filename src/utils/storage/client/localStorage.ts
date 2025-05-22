import { BaseStorage } from "./baseStorage";

/**
 * LocalStorage is a utility class for managing data in the browser's local storage.
 * It implements the IStorage interface to provide a consistent API for storage operations.
 */
export class LocalStorage extends BaseStorage {
  storage = typeof window !== "undefined" ? window.localStorage : undefined;
}

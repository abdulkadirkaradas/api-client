import { IStorage } from "../../../interfaces/storage";

/**
 * LocalStorage is a utility class for managing data in the browser's local storage.
 * It implements the IStorage interface to provide a consistent API for storage operations.
 */
export class LocalStorage implements IStorage {
  /**
   * Sets a value in the local storage with the given key.
   * 
   * @param key {string} - The key under which the value will be stored.
   * @param token {string} - The value to store in the local storage.
   */
  public set(key: string, token: string): void {
    // Use the browser's localStorage API to store the key-value pair.
    localStorage.setItem(key, token);
  }

  /**
   * Retrieves a value from the local storage by its key.
   * If the key does not exist, it returns null.
   * 
   * @param key {string} - The key of the value to retrieve.
   * @returns {string | null} - The value associated with the key, or null if the key does not exist.
   */
  public get(key: string): string | null {
    // Use the browser's localStorage API to retrieve the value by key.
    return localStorage.getItem(key);
  }

  /**
   * Removes a value from the local storage by its key.
   * 
   * @param key {string} - The key of the value to remove.
   */
  public remove(key: string): void {
    // Use the browser's localStorage API to remove the key-value pair.
    localStorage.removeItem(key);
  }

  /**
   * Clears all data from the local storage.
   * This removes all key-value pairs stored in the local storage.
   */
  public clear(): void {
    // Use the browser's localStorage API to clear all stored data.
    localStorage.clear();
  }
}

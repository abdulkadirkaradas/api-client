import { IStorage } from "../../../interfaces/storage";

/**
 * SessionStorage is a utility class for managing data in the browser's session storage.
 * It implements the IStorage interface to provide a consistent API for storage operations.
 * Session storage persists data only for the duration of the page session.
 */
export class SessionStorage implements IStorage {
  /**
   * Sets a value in the session storage with the given key.
   * 
   * @param key {string} - The key under which the value will be stored.
   * @param token {string} - The value to store in the session storage.
   */
  public set(key: string, token: string): void {
    // Use the browser's sessionStorage API to store the key-value pair.
    sessionStorage.setItem(key, token);
  }

  /**
   * Retrieves a value from the session storage by its key.
   * If the key does not exist, it returns null.
   * 
   * @param key {string} - The key of the value to retrieve.
   * @returns {string | null} - The value associated with the key, or null if the key does not exist.
   */
  public get(key: string): string | null {
    // Use the browser's sessionStorage API to retrieve the value by key.
    return sessionStorage.getItem(key);
  }

  /**
   * Removes a value from the session storage by its key.
   * 
   * @param key {string} - The key of the value to remove.
   */
  public remove(key: string): void {
    // Use the browser's sessionStorage API to remove the key-value pair.
    sessionStorage.removeItem(key);
  }

  /**
   * Clears all data from the session storage.
   * This removes all key-value pairs stored in the session storage.
   */
  public clear(): void {
    // Use the browser's sessionStorage API to clear all stored data.
    sessionStorage.clear();
  }
}

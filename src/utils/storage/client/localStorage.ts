import { IStorage } from "../../../interfaces/storage";

export class LocalStorage implements IStorage {
  /**
   * Sets the token in the local storage
   *
   * @param key
   * @param token
   */
  public set(key: string, token: string): void {
    localStorage.setItem(key, token);
  }

  /**
   * Gets the token from the local storage
   *
   * @param key
   * @returns
   */
  public get(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Removes the token from the local storage
   *
   * @param key
   */
  public remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears the local storage
   */
  public clear(): void {
    localStorage.clear();
  }
}

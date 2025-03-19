import { IStorage } from "../../../interfaces/storage";

export class SessionStorage implements IStorage {
  /**
   * Sets the token in the session storage
   *
   * @param key
   * @param token
   */
  public set(key: string, token: string): void {
    sessionStorage.setItem(key, token);
  }

  /**
   * Gets the token from the session storage
   *
   * @param key
   * @returns
   */
  public get(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  /**
   * Removes the token from the session storage
   *
   * @param key
   */
  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  /**
   * Clears the session storage
   */
  public clear(): void {
    sessionStorage.clear();
  }
}

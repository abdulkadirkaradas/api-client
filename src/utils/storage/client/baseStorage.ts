import { IStorage } from "../../../interfaces/storage";

/**
 * BaseStorage provides a template for browser storage implementations.
 * Subclass this for localStorage, sessionStorage, or custom storage.
 */
export abstract class BaseStorage implements IStorage {
  abstract storage: Storage | undefined;

  public set(key: string, value: string): void {
    this.storage?.setItem(key, value);
  }

  public get(key: string): string | null {
    return this.storage?.getItem(key) ?? null;
  }

  public remove(key: string): void {
    this.storage?.removeItem(key);
  }

  public clear(): void {
    this.storage?.clear();
  }
}

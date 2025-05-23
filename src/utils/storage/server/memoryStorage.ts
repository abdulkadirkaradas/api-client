import { IStorage } from "../../../interfaces/storage";

/**
 * MemoryStorage is a simple in-memory storage for Node.js environments.
 * It implements the IStorage interface.
 */
export class MemoryStorage implements IStorage {
  private store: Record<string, string> = {};

  set(key: string, value: string): void {
    this.store[key] = value;
  }

  get(key: string): string | null {
    return this.store[key] ?? null;
  }

  remove(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

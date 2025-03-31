export type StorageType = "localStorage" | "sessionStorage" | "cookie";

export type ServiceStorageCustomConfig = { [key: string]: StorageType };

export type StorageCustomConfig = { [key: string]: IStorage };

export interface IStorage {
  set(key: string, token: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  clear(): void;
}

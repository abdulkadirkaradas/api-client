export type StorageType = "localStorage" | "sessionStorage" | "cookie";

export interface IStorage {
  set(key: string, token: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  clear(): void;
}

export interface ClientServiceStorageConfig {
  [key: string]: {
    type: StorageType;
    storage?: IStorage;
  };
}
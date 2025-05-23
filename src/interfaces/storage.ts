export type NodeStorageType = "memoryStorage" | "fileStorage";
export type WebStorageType = "localStorage" | "sessionStorage" | "cookie";

export interface IStorage {
  load?(filename?: string): void;
  set(key: string, token: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  clear(): void;
}

export interface ClientServiceStorageConfig {
  [key: string]: {
    type: WebStorageType;
    storage?: IStorage;
  };
}
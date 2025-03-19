export type StorageType = "localStorage" | "sessionStorage" | "cookie" | "json";

export interface IStorage {
  set(key: string, token: string): void;
  get(key: string): string | null;
  remove(key: string): void;
  clear(): void;
}

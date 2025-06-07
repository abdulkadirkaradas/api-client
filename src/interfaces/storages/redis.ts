import Redis, { Callback } from "ioredis";

export interface IRedisStorage {
  client: Redis | null;
  connect(client: Redis, prefix?: string): void;
  set(
    type: RedisStorageTypes,
    data: RedisOperationByType<RedisStorageTypes>,
    options?: RedisStorageConfig
  ): void | Promise<void>;
  get(key: string): string | null | Promise<string | null>;
  getAllKeyValues(): Promise<string[]>;
  getAllKeys(): Promise<string[]>;
  exists(key: string): Promise<boolean>;
  expire(
    key: string,
    seconds: number | string,
    callback?: Callback<number>
  ): Promise<void>;
  incr(key: string): Promise<string | number>;
  remove(key: string): void | Promise<void>;
  clear(): void | Promise<void>;
}

type RedisDefaultKeyValuePair = {
  key: string;
  values: (string | Buffer | number)[];
};
export type RedisStringKeyValuePair = {
  [key: string]: {
    value: string | number | boolean | object;
    ttl?: number | string;
  };
};

export type RedisStorageTypes =
  | "string"
  | "hash"
  | "list"
  | "set"
  | "sortedSet";

export type RedisOperationByType<T extends RedisStorageTypes> =
  T extends "string"
    ? RedisStringKeyValuePair
    : T extends "hash"
    ? RedisDefaultKeyValuePair
    : T extends "list"
    ? RedisDefaultKeyValuePair
    : T extends "set"
    ? RedisDefaultKeyValuePair
    : T extends "sortedSet"
    ? RedisDefaultKeyValuePair
    : never;

export interface RedisStorageConfig {
  expirySeconds?: number;
  expiryMilliseconds?: number;
}

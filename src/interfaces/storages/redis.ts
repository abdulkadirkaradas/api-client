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
  remove(key: string): void | Promise<void>;
  clear(): void | Promise<void>;
}

export type RedisDefaultKeyValuePair = { [key: string]: string | number };
type RedisHashKeyValuePair = {
  key: string;
  values: RedisDefaultKeyValuePair;
};
type RedisListAndSetKeyValuePair = {
  key: string;
  values: string[] | number[];
};
type RedisSortedSetKeyValuePair = {
  key: string;
  values: RedisDefaultKeyValuePair[];
};

export type RedisStorageTypes =
  | "string"
  | "hash"
  | "list"
  | "set"
  | "sortedSet";

export type RedisOperationByType<T extends RedisStorageTypes> =
  T extends "string"
    ? RedisDefaultKeyValuePair
    : T extends "hash"
    ? RedisHashKeyValuePair
    : T extends "list"
    ? RedisListAndSetKeyValuePair
    : T extends "set"
    ? RedisListAndSetKeyValuePair
    : T extends "sortedSet"
    ? RedisSortedSetKeyValuePair
    : never;

export interface RedisStorageConfig {
  expirySeconds?: number;
  expiryMilliseconds?: number;
}

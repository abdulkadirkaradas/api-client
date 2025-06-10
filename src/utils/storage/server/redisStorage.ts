import { Callback, Redis } from "ioredis";
import {
  IRedisStorage,
  RedisHashKey,
  RedisOperationByType,
  RedisStorageConfig,
  RedisStorageTypes,
  RedisStringKeyValuePair,
} from "../../../interfaces/storages/redis";

type RedisSortedSetArgs = (string | number)[];

/**
 * RedisStorage class implements the IRedisStorage interface for Redis-based storage.
 * The class requires a Redis client to be connected before performing any operations.
 */
export class RedisStorage implements IRedisStorage {
  public client: Redis | null = null;
  private prefix: string = "moodo";

  public connect(client: Redis, prefix?: string) {
    this.client = client;

    if (prefix) {
      this.setPrefix(prefix);
    }
  }

  public getKey(key: string): string {
    if (this.prefix.includes(":")) {
      this.prefix.replace(":", "");
    }

    return `${this.prefix}:${key}`;
  }

  public ensureConnected() {
    if (!this.client) {
      throw new Error(
        "Redis connection could not be established. Please use connect function first."
      );
    }
  }

  public setPrefix(prefix: string): void {
    if (!prefix) return;

    if (prefix.includes(":")) {
      prefix = prefix.replace(":", "");
    }

    this.prefix = prefix;
  }

  public async set(
    type: RedisStorageTypes,
    data: RedisOperationByType<RedisStorageTypes>,
    options?: RedisStorageConfig
  ): Promise<void> {
    this.ensureConnected();
    let key: string | undefined;
    let values: any;
    if (typeof data === "object" && "key" in data && "values" in data) {
      key = this.getKey((data as any).key);
      values = (data as any).values;
    }
    switch (type) {
      case "string":
        await this.setString(data as RedisStringKeyValuePair);
        break;
      case "hash":
        await this.setHash(data, options);
        break;
      case "list":
        await this.client!.lpush(
          key!,
          ...Object.values(values).map((v) => v as string | number | Buffer)
        );
        break;
      case "set":
        await this.client!.sadd(
          key!,
          ...Object.values(values).map((v) => v as string | number | Buffer)
        );
        break;
      case "sortedSet":
        await this.setSortedSet(data);
        break;
      default:
        throw new Error("Unknown storage type");
    }
  }

  private async setString(data: RedisStringKeyValuePair) {
    const isIntegerString = (v: any) =>
      typeof v === "string" && /^-?\d+$/.test(v);
    await Promise.all(
      Object.entries(data).map(([key, { value, ttl }]) => {
        const storeValue =
          typeof value === "number" || isIntegerString(value)
            ? String(value)
            : JSON.stringify(value);

        return ttl
          ? this.client!.set(this.getKey(key), storeValue, "EX", Number(ttl))
          : this.client!.set(this.getKey(key), storeValue);
      })
    );
  }

  private async setHash(data: any, options?: RedisStorageConfig) {
    const keyWithPrefix = this.getKey(data.key) as string;

    await this.client!.hset(
      keyWithPrefix,
      ...(Object.entries(data.values).flat() as RedisHashKey)
    );
    if (options?.expirySeconds) {
      await this.client!.expire(keyWithPrefix as string, options.expirySeconds);
    } else if (options?.expiryMilliseconds) {
      await this.client!.pexpire(
        keyWithPrefix,
        options.expiryMilliseconds
      );
    }
  }

  private async setSortedSet(data: any) {
    const keyWithPrefix = this.getKey(data.key) as string;
    const args: RedisSortedSetArgs = Object.values(data.values);

    await this.client!.zadd(keyWithPrefix, ...args);
  }

  public async get(key: string): Promise<string | null> {
    this.ensureConnected();
    const res = await this.client!.get(this.getKey(key));

    return res !== null ? JSON.parse(res) : null;
  }

  public async getAllKeyValues(): Promise<string[]> {
    this.ensureConnected();
    const keys = await this.client!.keys(`${this.prefix}*`);
    const values = await Promise.all(keys.map((key) => this.client!.get(key)));
    return Object.fromEntries(
      keys
        .map((key, i) => [key.replace(`${this.prefix}:`, ""), values[i]])
        .filter(([, value]) => value !== null)
    );
  }

  public async getAllKeys(): Promise<string[]> {
    let keys = await this.client!.keys(`${this.prefix}*`);
    return keys;
  }

  public async exists(key: string): Promise<boolean> {
    this.ensureConnected();
    const redisKey = this.getKey(key);
    const exists = await this.client!.exists(redisKey);

    return exists > 0;
  }

  public async expire(
    key: string,
    seconds: number | string,
    callback?: Callback<number>
  ): Promise<void> {
    this.ensureConnected();
    const redisKey = this.getKey(key);
    if (callback) {
      await this.client!.expire(redisKey, seconds, callback);
    } else {
      await this.client!.expire(redisKey, seconds);
    }
  }

  public async incr(key: string): Promise<string | number> {
    this.ensureConnected();
    const redisKey = this.getKey(key);
    const exists = await this.exists(key);

    if (!exists) {
      throw new Error("Key does not exist in Redis.");
    }

    const count = await this.client!.incr(redisKey);
    return count;
  }

  public async remove(key: string): Promise<void> {
    this.ensureConnected();
    await this.client!.del(this.getKey(key));
  }

  public async clear(): Promise<void> {
    this.ensureConnected();
    const keys = await this.client!.keys(`${this.prefix}*`);
    if (keys.length > 0) {
      await this.client!.del(...keys);
    }
  }
}

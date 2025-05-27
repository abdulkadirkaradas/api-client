import { Callback, Redis } from "ioredis";
import {
  IRedisStorage,
  RedisOperationByType,
  RedisStorageConfig,
  RedisStorageTypes,
} from "../../../interfaces/storages/redis";

type RedisHashKey = (string | Buffer | number)[];
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
      this.prefix = prefix;
    }
  }

  private getKey(key: string): string {
    if (this.prefix.includes(":")) {
      this.prefix.replace(":", "");
    }

    return `${this.prefix}:${key}`;
  }

  private ensureConnected() {
    if (!this.client) {
      throw new Error(
        "Redis connection could not be established. Please use connect function first."
      );
    }
  }

  public async set(
    type: RedisStorageTypes,
    data: RedisOperationByType<RedisStorageTypes>,
    options?: RedisStorageConfig
  ): Promise<void> {
    this.ensureConnected();
    switch (type) {
      case "string":
        await this.client!.mset(data);
        break;
      case "hash":
        await this.setHash(data, options);
        break;
      case "list":
        await this.client!.lpush(data.key as string, ...(data.values as any[]));
        break;
      case "set":
        await this.client!.sadd(data.key as string, ...(data.values as any[]));
        break;
      case "sortedSet":
        await this.setSortedSet(data);
        break;
      default:
        throw new Error("Unknown storage type");
    }
  }

  private async setHash(data: any, options?: RedisStorageConfig) {
    await this.client!.hset(
      data.key as string,
      ...(Object.entries(data.values).flat() as RedisHashKey)
    );
    if (options?.expirySeconds) {
      await this.client!.expire(data.key as string, options.expirySeconds);
    } else if (options?.expiryMilliseconds) {
      await this.client!.pexpire(
        data.key as string,
        options.expiryMilliseconds
      );
    }
  }

  private async setSortedSet(data: any) {
    const args: RedisSortedSetArgs = [];
    for (const item of data.values) {
      args.push(item.score, item.value);
    }
    await this.client!.zadd(data.key as string, ...args);
  }

  public async get(key: string): Promise<string | null> {
    this.ensureConnected();
    return await this.client!.get(this.getKey(key));
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

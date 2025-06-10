import Redis from "ioredis";
import { IRedisStorage } from "../../../interfaces/storages/redis";
import { StorageFactory } from "../../../utils/storage/storageFactory";

type CacheSetKeyValuePair = {
  [key: string]: {
    value: string | number | object;
    ttl?: number;
  };
};
type RedisHashValueConfig = { [key: string]: string | number | boolean };

export class RedisService {
  private storageFactory: StorageFactory;
  public redis: IRedisStorage;

  constructor() {
    this.storageFactory = new StorageFactory();
    this.redis = this.storageFactory.createRedisStorage();
  }

  public connect(redis: Redis, prefix: string) {
    this.redis.connect(redis, prefix);
    this.redis.setPrefix(prefix);
  }

  // Rate Limiter Method
  public async isAllowed(
    key: string,
    limit: number,
    windowSeconds: number
  ): Promise<{ allowed: boolean; remaining: number }> {
    this.redis.ensureConnected();

    if (!await this.redis.exists(key)) {
      return { allowed: false, remaining: 0 };
    }
    const count = <number>await this.redis.incr(key) || 0;

    if (count === 1) await this.redis.expire(key, windowSeconds);

    return {
      allowed: count <= limit,
      remaining: Math.max(0, limit - count),
    };
  }

  // Cache Methods
  public async getCache(key: string): Promise<string | number | object | null> {
    this.redis.ensureConnected();

    const cached = await this.redis.get(key);

    return cached ?? null;
  }

  public async setCache(
    key: string,
    ttl: number = 0,
    fetcher: () => Promise<string | number | object>
  ): Promise<string | number | object> {
    this.redis.ensureConnected();

    const result = await fetcher();
    const args: CacheSetKeyValuePair = {
      [key]: {
        value: result,
        ...(ttl !== 0 ? { ttl } : {}),
      },
    };

    await this.redis.set("string", args);

    return result;
  }

  // Deduplication Method
  public async isUnique(key: string, ttl?: number): Promise<boolean> {
    this.redis.ensureConnected();

    const exists = await this.redis.exists(key);

    if (exists) {
      return false;
    }

    await this.redis.set("string", {
      [key]: {
        value: true,
        ...(ttl !== 0 ? { ttl } : {}),
      },
    });

    return true;
  }

  // Queue Method
  public async pushToQueue(key: string, data: RedisHashValueConfig) {
    this.redis.ensureConnected();

    await this.redis.set("list", {
      key: key,
      values: data,
    });
  }

  public async popFromQueue(key: string): Promise<boolean> {
    this.redis.ensureConnected();

    const result = await this.redis.client?.rpop(this.redis.getKey(key));

    return result !== null ? true : false;
  }

  // Token Blacklisting Method
  public async blacklistToken(token: string, ttl: number = 3600) {
    this.redis.ensureConnected();
    
    await this.redis.set("string", {
      [token]: {
        value: true,
        ttl: ttl,
      },
    });
  }

  public async isTokenBlacklisted(token: string): Promise<boolean> {
    this.redis.ensureConnected();

    const exists = await this.redis.exists(token);
    return exists;
  }
}

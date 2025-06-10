import Redis from "ioredis";
import { RedisService } from "../../src/core/services/server/redisService";
import { TestSetup } from "../utils/testSetup";

describe("RedisService", () => {
  let setup: TestSetup = new TestSetup();
  let redis: Redis;
  let redisService: RedisService;
  const prefix = "test:";

  redis = new Redis();
  redisService = setup.redisService;
  redisService.connect(redis, prefix);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (redisService.redis.client) {
      await redisService.redis.client.flushdb();
      await redisService.redis.client.quit();
      redisService.redis.client.disconnect?.();
    }
  }, 15000);

  it("should set and get cache", async () => {
    const value = await redisService.setCache(
      "cacheKey",
      1,
      async () => "cacheValue"
    );
    expect(value).toBe("cacheValue");
    const cached = await redisService.getCache("cacheKey");
    expect(cached).toBe("cacheValue");
  });

  it("should expire cache after ttl", async () => {
    await redisService.setCache("ttlKey", 1, async () => "ttlValue");
    expect(await redisService.getCache("ttlKey")).toBe("ttlValue");
    await new Promise((res) => setTimeout(res, 1100));
    expect(await redisService.getCache("ttlKey")).toBeNull();
  });

  it("should check isUnique", async () => {
    expect(await redisService.isUnique("uniqueKey", 1)).toBe(true);
    expect(await redisService.isUnique("uniqueKey", 1)).toBe(false);
    await new Promise((res) => setTimeout(res, 1100));
    expect(await redisService.isUnique("uniqueKey", 1)).toBe(true);
  });

  it("should push and pop from queue", async () => {
    await redisService.pushToQueue("queueKey", { 0: "a", 1: "b", 2: "c" });

    expect(
      await redisService.redis.client?.lrange(`${prefix}queueKey`, 0, -1)
    ).toEqual(["c", "b", "a"]);
    expect(await redisService.popFromQueue("queueKey")).toBe(true);

    const afterPop = await redisService.redis.client?.lrange(
      `${prefix}queueKey`,
      0,
      -1
    );
    expect(afterPop?.length).toBe(2);
  });

  it("should return false when popFromQueue on empty", async () => {
    expect(await redisService.popFromQueue("emptyKey")).toBe(false);
  });

  it("should allow rate limiting", async () => {
    const key = "rateKey";
    redisService.redis.set("string", {
      [key]: { value: 0 },
    });

    for (let i = 1; i <= 3; i++) {
      const res = await redisService.isAllowed(key, 3, 1);
      expect(res.allowed).toBe(true);
      expect(res.remaining).toBe(3 - i);
    }

    const res = await redisService.isAllowed(key, 3, 1);
    expect(res.allowed).toBe(false);
    expect(res.remaining).toBe(0);

    redisService.redis.set("string", {
      [key]: { value: 0 },
    });

    await new Promise((res) => setTimeout(res, 1100));
    const after = await redisService.isAllowed(key, 3, 1);
    expect(after.allowed).toBe(true);
    expect(after.remaining).toBe(2);
  });

  it("should blacklist a token and check its existence", async () => {
    const token = "tokentest";
    const ttl = 1;

    await redisService.blacklistToken(token, ttl);
    const exists = await redisService.isTokenBlacklisted(token);
    expect(exists).toBe(true);

    await new Promise((res) => setTimeout(res, 1100));
    const existsAfter = await redisService.isTokenBlacklisted(token);
    expect(existsAfter).toBe(false);
  });
});

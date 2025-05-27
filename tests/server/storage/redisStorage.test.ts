import Redis from "ioredis";
import { TestSetup } from "../../utils/testSetup";
import { IRedisStorage } from "../../../src/interfaces/storages/redis";

describe("API Client Storage/RedisStorage operations", () => {
  let setup: TestSetup;
  let storage: IRedisStorage;
  let redis: Redis;
  const prefix = "test";

  beforeEach(() => {
    setup = new TestSetup();
    jest.clearAllMocks();

    storage = setup.storage.createRedisStorage();
    redis = new Redis();
    storage.connect(redis, prefix);
  });

  afterAll(async () => {
    if (storage.client) {
      await storage.client.flushdb();
      await storage.client.quit();
    }
  }, 15000);

  it("Should set and get string key-values", async () => {
    const data = { [prefix + ":str1"]: "val1", [prefix + ":str2"]: "val2" };
    await storage.set("string", data);
    const v1 = await storage.get("str1");
    const v2 = await storage.get("str2");
    expect(v1).toBe("val1");
    expect(v2).toBe("val2");
  });

  it("Should set and get hash", async () => {
    const data = {
      key: prefix + ":hash1",
      values: { field1: "fval1", field2: "fval2" },
    };
    await storage.set("hash", data, { expirySeconds: 2 });
    const h1 = await redis.hgetall(prefix + ":hash1");
    expect(h1.field1).toBe("fval1");
    expect(h1.field2).toBe("fval2");
    // Expiry test: hash mast be removed after 2 seconds
    await new Promise((res) => setTimeout(res, 2100));
    const h2 = await redis.hgetall(prefix + ":hash1");
    expect(Object.keys(h2).length).toBe(0);
  });

  it("Should set and get list", async () => {
    const data = { key: prefix + ":list1", values: ["a", "b", "c"] };
    await storage.set("list", data);
    const l1 = await redis.lrange(prefix + ":list1", 0, -1);
    expect(l1).toEqual(["c", "b", "a"]); // lpush reverses order
  });

  it("Should set and get set", async () => {
    const data = { key: prefix + ":set1", values: ["x", "y", "z"] };
    await storage.set("set", data);
    const s1 = await redis.smembers(prefix + ":set1");
    expect(s1.sort()).toEqual(["x", "y", "z"]);
  });

  it("Should set and get sortedSet", async () => {
    const data = {
      key: prefix + ":zset1",
      values: [
        { score: 1, value: "a" },
        { score: 2, value: "b" },
      ],
    };
    await storage.set("sortedSet", data);
    const z1 = await redis.zrange(prefix + ":zset1", 0, -1, "WITHSCORES");
    expect(z1).toEqual(["a", "1", "b", "2"]);
  });

  it("Should check key exists", async () => {
    await storage.set("string", { [prefix + ":exists"]: "test" });
    const exists = await storage.exists("exists");
    expect(exists).toBe(true);
  });

  it("Should expire key", async () => {
    await storage.set("string", { [prefix + ":expire"]: "test" });
    await storage.expire("expire", 1);
    const existsBefore = await storage.exists("expire");
    expect(existsBefore).toBe(true);
    
    // Wait for expiration
    await new Promise((res) => setTimeout(res, 1100));
    const existsAfter = await storage.exists("expire");
    expect(existsAfter).toBe(false);
  });

  it("Should increment key", async () => {
    await storage.set("string", { [prefix + ":inc"]: "1" });
    const value = await storage.incr("inc");
    expect(`${value}`).toBe("2");
  });

  it("Should remove data", async () => {
    await storage.set("string", { [prefix + ":strremove"]: "toremove" });
    await storage.remove("strremove");
    const value = await storage.get("strremove");
    expect(value).toBeNull();
  });

  it("Should clear all data", async () => {
    await storage.set("string", { [prefix + ":key1"]: "val1" });
    await storage.set("string", { [prefix + ":key2"]: "val2" });
    await storage.clear();
    const v1 = await storage.get("key1");
    const v2 = await storage.get("key2");
    expect(v1).toBeNull();
    expect(v2).toBeNull();
  });
});

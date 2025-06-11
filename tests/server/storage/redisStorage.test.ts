import Redis from "ioredis";
import { TestSetup } from "../../utils/testSetup";
import { IRedisStorage } from "../../../src/interfaces/storages/redis";

describe("API Client Storage/RedisStorage operations", () => {
  let setup: TestSetup = new TestSetup();
  let storage: IRedisStorage;
  let redis: Redis;
  const prefix = "test:";

  storage = setup.storage.createRedisStorage();
  redis = new Redis();
  storage.connect(redis, prefix);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    if (storage.client) {
      await storage.client.flushdb();
      await storage.client.quit();
      storage.client.disconnect?.();
    }
  }, 15000);

  it("Should set and get string key-values", async () => {
    await storage.set("string", {
      str1: { value: "val1" },
      str2: { value: "val2" },
    });

    const v1 = await storage.get("str1");
    const v2 = await storage.get("str2");
    expect(v1).toBe("val1");
    expect(v2).toBe("val2");
  });

  it("Should set string with TTL and expire after time", async () => {
    await storage.set("string", {
      strttl1: { value: "vttl1", ttl: 1 },
      strttl2: { value: "vttl2", ttl: 1 },
    });

    const v1 = await storage.get("strttl1");
    const v2 = await storage.get("strttl2");
    expect(v1).toBe("vttl1");
    expect(v2).toBe("vttl2");
    
    // Expiry test: keys must be removed after 1 second
    await new Promise((res) => setTimeout(res, 1100));
    const v1after = await storage.get("strttl1");
    const v2after = await storage.get("strttl2");
    expect(v1after).toBeNull();
    expect(v2after).toBeNull();
  });

  it("Should set and get hash", async () => {
    const data = {
      key: "hash1",
      values: { field1: "fval1", field2: "fval2" },
    };
    await storage.set("hash", data, { expirySeconds: 2 });
    const h1 = await storage.client?.hgetall(`${prefix}hash1`);
    expect(h1?.field1).toBe("fval1");
    expect(h1?.field2).toBe("fval2");

    // Expiry test: hash mast be removed after 2 seconds
    await new Promise((res) => setTimeout(res, 2100));
    const h2 = await storage.client?.hgetall(`${prefix}hash1`);
    expect(Object.keys(h2 ?? {}).length).toBe(0);
  });

  it("Should set and get list", async () => {
    const data = { key: "list1", values: { 0: "a", 1: "b", 2: "c" } };
    await storage.set("list", data);

    const l1 = await storage.client?.lrange(`${prefix}list1`, 0, -1);
    expect(l1).toEqual(["c", "b", "a"]); // lpush reverses order
  });

  it("Should set and get set", async () => {
    const data = { key: "set1", values: { 0: "x", 1: "y", 2: "z" } };
    await storage.set("set", data);

    const s1 = await storage.client?.smembers(`${prefix}set1`);
    expect((s1 ?? []).sort()).toEqual(["x", "y", "z"]);
  });

  it("Should set and get sortedSet", async () => {
    const data = {
      key: "zset1",
      values: { 0: 1, 1: "a", 2: 2, 3: "b" },
    };

    await storage.set("sortedSet", data);
    const z1 = await storage.client?.zrange(
      `${prefix}zset1`,
      0,
      -1,
      "WITHSCORES"
    );
    expect(z1).toEqual(["a", "1", "b", "2"]);
  });

  it("Should check key exists", async () => {
    await storage.set("string", { exists: { value: "test" } });
    const exists = await storage.exists("exists");
    expect(exists).toBe(true);
  });

  it("Should expire key", async () => {
    await storage.set("string", { expire: { value: "test" } });
    await storage.expire("expire", 1);

    const existsBefore = await storage.exists("expire");
    expect(existsBefore).toBe(true);

    // Wait for expiration
    await new Promise((res) => setTimeout(res, 1100));
    const existsAfter = await storage.exists("expire");
    expect(existsAfter).toBe(false);
  });

  it("Should increment key", async () => {
    await storage.set("string", { inc: { value: "1" } });
    const value = await storage.incr("inc");
    expect(`${value}`).toBe("2");
  });

  it("Should remove data", async () => {
    await storage.set("string", { strremove: { value: "toremove" } });
    await storage.remove("strremove");

    const value = await storage.get("strremove");
    expect(value).toBeNull();
  });

  it("Should clear all data", async () => {
    await storage.set("string", { key1: { value: "val1" } });
    await storage.set("string", { key2: { value: "val2" } });
    await storage.clear();

    const v1 = await storage.get("key1");
    const v2 = await storage.get("key2");
    
    expect(v1).toBeNull();
    expect(v2).toBeNull();
  });
});

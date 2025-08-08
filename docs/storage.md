# Storage Service

The Storage Service facade provides various storage options and a centralized management structure for node and browser environments. For the browser, it provides Local, Session, and Cookie storages, while for Node, it offers Redis, File, and Memory storages.

## Basic Storage Types

LocalStorage, SessionStorage, CookieStorage, FileStorage, and MemoryStorage storages usage are the same.

> [!note]
>
> For checking types and interfaces, please refer to the following files:
> - [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storage.ts#L1)

```typescript
import moodo from "moodo";

const instance = new moodo({ ... });

const storageService = moodo.StorageFactory;

// See; interfaces/storage.ts:
const storage = storageService.createStorage("web", "localStorage");
const storage = storageService.createStorage("node", "file");

storage.set("key", "value");
const value = storage.get("key");
storage.remove("key");
storage.clear();
```

## RedisStorage

The RedisStorage is a built-in Redis storage management service that provides basic Redis operations.

> [!note]
>
> RedisStorage works asynchronously, so don't forget to use `await` in your calls.

### Basic Setup

```typescript
import Redis from "ioredis";

const storage = StorageFactory.createRedisStorage();
const redis = new Redis();

// Connect to Redis with optional prefix
await storage.connect(redis, "myapp");

// Set prefix for all keys
storage.setPrefix("myprefix");
```

### String Operations

```typescript
// Set string values with optional TTL
await storage.set("string", {
  user1: { value: "John Doe" },
  user2: { value: "Jane Smith" },
  tempKey: { value: "temporary data", ttl: 60 } // expires in 60 seconds
});

// Get string value
const userName = await storage.get("user1");
console.log(userName); // "John Doe"
```

### Hash Operations

```typescript
// Set hash with expiry
await storage.set("hash", {
  key: "userProfile",
  values: { 
    name: "John Doe", 
    email: "john@example.com", 
    age: "30" 
  }
}, { expirySeconds: 3600 }); // expires in 1 hour
```

### List Operations

```typescript
// Set list values
await storage.set("list", {
  key: "todoList",
  values: { 0: "task1", 1: "task2", 2: "task3" }
});
```

### Set Operations

```typescript
// Set unique values
await storage.set("set", {
  key: "uniqueItems",
  values: { 0: "item1", 1: "item2", 2: "item3" }
});
```

### Sorted Set Operations

```typescript
// Set sorted set with scores
await storage.set("sortedSet", {
  key: "leaderboard",
  values: { 0: 100, 1: "player1", 2: 200, 3: "player2" }
});
```

### Key Management Operations

```typescript
// Check if key exists
const keyExists = await storage.exists("user1");
console.log(keyExists); // true

// Set expiration for a key
await storage.expire("user1", 300); // expires in 5 minutes

// Increment numeric value
await storage.set("string", { counter: { value: "1" } });
const newValue = await storage.incr("counter");
console.log(newValue); // 2

// Get all keys with current prefix
const allKeys = await storage.getAllKeys();
console.log(allKeys); // ["myprefix:user1", "myprefix:user2", ...]

// Get all key-value pairs
const allKeyValues = await storage.getAllKeyValues();
console.log(allKeyValues); // { user1: "John Doe", user2: "Jane Smith", ... }

// Remove specific key
await storage.remove("user1");

// Clear all keys with current prefix
await storage.clear();
```

## Related Documentation

- **[Redis Service](./redis-service.md)** - High-level Redis operations for caching, rate limiting, and queuing
- **[API Client](./api-client.md)** - HTTP client configuration
- **[Examples](./examples/)** - More usage examples

# RedisService

The `RedisService` class provides high-level Redis operations for common use cases like caching, rate limiting, deduplication, queuing, and token blacklisting. It wraps the lower-level `RedisStorage` and provides convenient methods for server-side applications.

## Features

- **Caching**: Store and retrieve data with TTL support
- **Rate Limiting**: Control API request rates per key
- **Deduplication**: Ensure unique operations within time windows
- **Queue Operations**: FIFO queue management
- **Token Blacklisting**: Manage JWT/token blacklists

## Installation & Setup

```typescript
import { moodo } from 'moodo';
import Redis from 'ioredis';

// Create Redis connection
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  // other Redis options...
});
const moodo = new moodo({ ... });
const redisService = moodo.Services.redis;

// Initialize RedisService
redisService.connect(redis, 'myapp:');
```

## API Reference

### Constructor

```typescript
const moodo = new moodo({ ... });
const redisService = moodo.Services.redis;
```

Creates a new RedisService instance with an internal `StorageFactory` and `RedisStorage`.

### Connection

#### `connect(redis: Redis, prefix: string)`

Connects the service to a Redis instance with a key prefix.

**Parameters:**
- `redis`: ioredis Redis instance
- `prefix`: Key prefix for all Redis operations. This parameter is optional and defaults to 'moodo:'.

```typescript
const redis = new Redis();
redisService.connect(redis, 'app:');
```

## Caching Methods

### `async setCache(key: string, ttl: number = 0, fetcher: () => Promise<T>): Promise<T>`

Sets a cache value by executing a fetcher function. If the value exists, returns cached data; otherwise executes the fetcher and caches the result.

**Parameters:**
- `key`: Cache key
- `ttl`: Time to live in seconds (optional, 0 = no expiration)
- `fetcher`: Function that returns the value to cache

**Returns:** The cached or fetched value

```typescript
// Cache API response for 60 seconds
const userData = await redisService.setCache(
  'user:123',
  60,
  async () => {
    const response = await fetch('/api/users/123');
    return response.json();
  }
);

// Cache without expiration
const config = await redisService.setCache(
  'app:config',
  0,
  async () => {
    return { theme: 'dark', language: 'en' };
  }
);
```

### `async getCache(key: string): Promise<string | number | object | null>`

Retrieves a cached value by key.

**Parameters:**
- `key`: Cache key

**Returns:** Cached value or null if not found

```typescript
const cachedUser = await redisService.getCache('user:123');
if (cachedUser) {
  console.log('Found in cache:', cachedUser);
} else {
  console.log('Cache miss');
}
```

## Rate Limiting

### `async isAllowed(key: string, limit: number, windowSeconds: number): Promise<{allowed: boolean, remaining: number}>`

Implements sliding window rate limiting.

**Parameters:**
- `key`: Rate limit key (usually user ID or IP)
- `limit`: Maximum requests allowed
- `windowSeconds`: Time window in seconds

**Returns:** Object with `allowed` status and `remaining` count

```typescript
// Allow 10 requests per minute per user
const rateLimit = await redisService.isAllowed(
  `rate:user:${userId}`,
  10,
  60
);

if (rateLimit.allowed) {
  console.log(`Request allowed. ${rateLimit.remaining} remaining`);
  // Process request
} else {
  console.log('Rate limit exceeded');
  // Return 429 Too Many Requests
}

// API endpoint rate limiting
const apiLimit = await redisService.isAllowed(
  `api:${endpoint}:${clientId}`,
  100,
  3600 // 100 requests per hour
);
```

## Deduplication

### `async isUnique(key: string, ttl?: number): Promise<boolean>`

Ensures an operation is unique within a time window.

**Parameters:**
- `key`: Unique operation key
- `ttl`: Time window in seconds (optional)

**Returns:** True if unique, false if duplicate

```typescript
// Prevent duplicate form submissions
const submitKey = `submit:${userId}:${formId}:${timestamp}`;
const isUnique = await redisService.isUnique(submitKey, 300); // 5 minutes

if (isUnique) {
  // Process form submission
  console.log('Processing unique submission');
} else {
  console.log('Duplicate submission detected');
}

// Prevent duplicate payment processing
const paymentKey = `payment:${orderId}`;
const canProcess = await redisService.isUnique(paymentKey, 600); // 10 minutes

if (canProcess) {
  // Process payment
} else {
  throw new Error('Payment already processed');
}
```

## Queue Operations

### `async pushToQueue(key: string, data: Record<string, string | number | boolean>)`

Pushes data to a Redis list (FIFO queue).

**Parameters:**
- `key`: Queue key
- `data`: Object with key-value pairs to push

```typescript
// Add job to processing queue
await redisService.pushToQueue('jobs:email', {
  type: 'email',
  recipient: 'user@example.com',
  template: 'welcome',
  priority: 1
});

// Add multiple items
await redisService.pushToQueue('tasks:image', {
  0: 'resize:image1.jpg',
  1: 'resize:image2.jpg',
  2: 'resize:image3.jpg'
});
```

### `async popFromQueue(key: string): Promise<boolean>`

Pops an item from the queue (LIFO - last in, first out).

**Parameters:**
- `key`: Queue key

**Returns:** True if item was popped, false if queue is empty

```typescript
// Process queue items
while (await redisService.popFromQueue('jobs:email')) {
  console.log('Processing email job...');
  // Process the job
}

// Worker pattern
const processQueue = async () => {
  const hasWork = await redisService.popFromQueue('tasks:image');
  if (hasWork) {
    console.log('Processing image task...');
    // Process task
  } else {
    console.log('Queue is empty');
  }
};
```

## Token Blacklisting

### `async blacklistToken(token: string, ttl: number = 3600)`

Adds a token to the blacklist.

**Parameters:**
- `token`: Token to blacklist
- `ttl`: Blacklist duration in seconds (default: 1 hour)

```typescript
// Blacklist JWT token on logout
await redisService.blacklistToken(jwtToken, 3600); // 1 hour

// Blacklist API key
await redisService.blacklistToken(apiKey, 86400); // 24 hours
```

### `async isTokenBlacklisted(token: string): Promise<boolean>`

Checks if a token is blacklisted.

**Parameters:**
- `token`: Token to check

**Returns:** True if blacklisted, false otherwise

```typescript
// Middleware to check token blacklist
const checkBlacklist = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (await redisService.isTokenBlacklisted(token)) {
    return res.status(401).json({ error: 'Token is blacklisted' });
  }
  
  next();
};

// Check before processing request
if (await redisService.isTokenBlacklisted(userToken)) {
  throw new Error('Token has been revoked');
}
```

## Complete Examples

### E-commerce Rate Limiting & Caching

```typescript
import { moodo, RedisService } from 'moodo';
import Redis from 'ioredis';

class EcommerceService {
  private redisService: RedisService;

  constructor() {
    const moodo = new moodo({ ... });
    this.redisService = moodo.Services.redis;
    
    const redis = new Redis(process.env.REDIS_URL);
    this.redisService.connect(redis, 'ecommerce:');
  }

  async getProduct(productId: string, userId: string) {
    // Rate limiting: 100 requests per hour per user
    const rateLimit = await this.redisService.isAllowed(
      `rate:${userId}`,
      100,
      3600
    );

    if (!rateLimit.allowed) {
      throw new Error('Rate limit exceeded');
    }

    // Cache product data for 5 minutes
    return await this.redisService.setCache(
      `product:${productId}`,
      300,
      async () => {
        // Fetch from database
        return await this.fetchProductFromDB(productId);
      }
    );
  }

  async processOrder(orderId: string, userId: string) {
    // Prevent duplicate order processing
    const isUnique = await this.redisService.isUnique(
      `order:${orderId}`,
      600 // 10 minutes
    );

    if (!isUnique) {
      throw new Error('Order already processed');
    }

    // Add to processing queue
    await this.redisService.pushToQueue('orders:process', {
      orderId,
      userId,
      timestamp: Date.now().toString()
    });

    return { success: true, orderId };
  }
}
```

### Authentication Service

```typescript
class AuthService {
  private redisService: RedisService;

  constructor() {
    const moodo = new moodo({ ... });
    this.redisService = moodo.Services.redis;

    const redis = new Redis();
    this.redisService.connect(redis, 'auth:');
  }

  async login(email: string, password: string, ip: string) {
    // Rate limiting: 5 login attempts per 15 minutes per IP
    const rateLimit = await this.redisService.isAllowed(
      `login:${ip}`,
      5,
      900
    );

    if (!rateLimit.allowed) {
      throw new Error('Too many login attempts');
    }

    // Authenticate user...
    const token = await this.authenticateUser(email, password);
    return token;
  }

  async logout(token: string) {
    // Blacklist token for remaining TTL
    const tokenTTL = this.getTokenTTL(token);
    await this.redisService.blacklistToken(token, tokenTTL);
  }

  async validateToken(token: string) {
    // Check if token is blacklisted
    if (await this.redisService.isTokenBlacklisted(token)) {
      throw new Error('Token is blacklisted');
    }

    // Continue with token validation...
  }
}
```

## Error Handling

All RedisService methods automatically ensure Redis connection before operations. If Redis is not connected, methods will throw appropriate errors.

```typescript
try {
  const result = await redisService.getCache('mykey');
} catch (error) {
  console.error('Redis operation failed:', error.message);
  // Handle fallback logic
}
```

## Best Practices

1. **Use descriptive key prefixes** to organize your data
2. **Set appropriate TTL values** to prevent memory bloat
3. **Handle Redis failures gracefully** with try-catch blocks
4. **Use rate limiting** to protect your APIs
5. **Implement proper cleanup** for blacklisted tokens
6. **Monitor queue sizes** to prevent memory issues

## Related Documentation

- [Storage](./storage.md) - Lower-level storage operations
- [API Client](./api-client.md) - HTTP client configuration
- [Examples](./examples/) - More usage examples

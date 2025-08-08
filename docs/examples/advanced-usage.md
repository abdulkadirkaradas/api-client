# Advanced Usage Examples

This document contains advanced usage examples and patterns for Moodo API Client.

## Custom Interceptors

### Request Interceptor with Dynamic Headers

```typescript
const instance = new moodo({
  baseURL: "https://api.example.com"
});

// Add dynamic headers using setHeaders method
instance.interceptorService.request.setHeaders({
  'X-Request-Time': Date.now().toString(),
  'X-User-Agent': 'Moodo-Analytics-Client'
});

// You can also conditionally set headers by getting current request info
// Note: Direct interceptor addition is not available in the current API
// Use the built-in setHeaders method instead
```

### Response Interceptor Configuration

```typescript
// Set token refresh configuration for automatic token management
instance.interceptorService.response.setTokenRefreshConfig({
  url: "/auth/refresh-token"
});

// The built-in response interceptor handles:
// - Automatic token refresh on 401 errors
// - Retry logic for 500, 502, 503 status codes
// - Error handling and logging

// For custom error handling, use try-catch with API calls
try {
  const response = await instance.methods.get("/users");
  console.log(`✅ GET /users - ${response.status}`);
} catch (error) {
  if (error.response?.status === 429) {
    console.warn('⚠️ Rate limit exceeded');
    // Implement custom retry logic here
  }
  throw error;
}
```

## Advanced Authentication Patterns

### Multi-tenant Authentication

```typescript
class MultiTenantAuth {
  private instances: Map<string, any> = new Map();

  createTenant(tenantId: string, config: any) {
    const instance = new moodo({
      ...config,
      headers: {
        ...config.headers,
        'X-Tenant-ID': tenantId
      }
    });

    this.instances.set(tenantId, instance);
    return instance;
  }

  getInstance(tenantId: string) {
    return this.instances.get(tenantId);
  }
}

const auth = new MultiTenantAuth();
const tenant1 = auth.createTenant('tenant-1', { baseURL: 'https://api.example.com' });
const tenant2 = auth.createTenant('tenant-2', { baseURL: 'https://api.example.com' });
```

### JWT Token Refresh with EventBus

```typescript
const instance = new moodo({
  baseURL: "https://api.example.com",
  authProtocol: {
    useAuthProtocol: true,
    useOAUTHProtocol: true,
  }
});

// Listen for token refresh events
instance.EventBus.subscribe("tokenRefreshed", "auth", (tokenData) => {
  console.log("Token refreshed successfully:", tokenData);
  // Update UI, broadcast to other components, etc.
});

instance.EventBus.subscribe("tokenRefreshFailed", "auth", (error) => {
  console.error("Token refresh failed:", error);
  // Redirect to login, show notification, etc.
});
```

## Complex Storage Patterns

### Hybrid Storage Strategy

```typescript
import { moodo } from "moodo";

class HybridStorage {
  private memoryCache = new Map();
  private localStorage: any;
  private redisStorage: any;

  constructor() {
    const instance = new moodo({ ... });
    const storageFactory = instance.StorageFactory();

    // Initialize different storage types
    this.localStorage = storageFactory.createStorage("web", "localStorage");
    this.redisStorage = storageFactory.createRedisStorage();
  }

  async set(key: string, value: any, options?: { ttl?: number, persistent?: boolean }) {
    // Always cache in memory for fast access
    this.memoryCache.set(key, value);

    // Store in localStorage for persistence across sessions
    if (options?.persistent) {
      this.localStorage.set(key, value);
    }

    // Store in Redis for shared access (if available)
    if (this.redisStorage.client) {
      await this.redisStorage.set("string", { [key]: { value, ttl: options?.ttl } });
    }
  }

  async get(key: string) {
    // Try memory first (fastest)
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // Try localStorage next
    const localValue = this.localStorage.get(key);
    if (localValue) {
      this.memoryCache.set(key, localValue); // Cache for next time
      return localValue;
    }

    // Try Redis last
    if (this.redisStorage.client) {
      const redisValue = await this.redisStorage.get(key);
      if (redisValue) {
        this.memoryCache.set(key, redisValue);
        return redisValue;
      }
    }

    return null;
  }
}
```

## EventBus Advanced Patterns

### Event-Driven API State Management

```typescript
class APIStateManager {
  constructor(private eventBus: any) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // API call started
    this.eventBus.subscribe("apiCallStart", "method", (request) => {
      this.updateLoadingState(request.url, true);
    }, 1);

    // API call completed
    this.eventBus.subscribe("apiCallComplete", "method", (response) => {
      this.updateLoadingState(response.config.url, false);
      this.cacheResponse(response);
    }, 1);

    // API call failed
    this.eventBus.subscribe("apiCallError", "method", (error) => {
      this.updateLoadingState(error.config?.url, false);
      this.handleError(error);
    }, 1);
  }

  private updateLoadingState(url: string, loading: boolean) {
    // Update UI loading indicators
    console.log(`${url} loading: ${loading}`);
  }

  private cacheResponse(response: any) {
    // Cache successful responses
    if (response.status === 200) {
      // Store in cache with TTL
    }
  }

  private handleError(error: any) {
    // Show user-friendly error messages
    // Log errors for debugging
    // Retry failed requests if appropriate
  }
}

const stateManager = new APIStateManager(instance.EventBus);
```

### Cross-Component Communication

```typescript
// Component A - Data Producer
class DataProducer {
  constructor(private eventBus: any) {}

  async fetchUserData(userId: string) {
    try {
      const response = await instance.methods.get(`/users/${userId}`);
      
      // Emit data to interested components
      this.eventBus.emit("userDataFetched", "regular", {
        userId,
        userData: response.data,
        timestamp: Date.now()
      });
      
      return response.data;
    } catch (error) {
      this.eventBus.emit("userDataError", "regular", { userId, error });
      throw error;
    }
  }
}

// Component B - Data Consumer
class UserProfile {
  constructor(private eventBus: any) {
    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.eventBus.subscribe("userDataFetched", "regular", (data) => {
      this.updateProfile(data.userData);
    });

    this.eventBus.subscribe("userDataError", "regular", (error) => {
      this.showError(error);
    });
  }

  private updateProfile(userData: any) {
    // Update UI with new data
  }

  private showError(error: any) {
    // Show error message
  }
}

// Component C - Analytics Tracker
class AnalyticsTracker {
  constructor(private eventBus: any) {
    // Track all user data fetches
    this.eventBus.subscribe("userDataFetched", "regular", (data) => {
      this.trackEvent("user_profile_viewed", {
        userId: data.userId,
        timestamp: data.timestamp
      });
    }, 0); // Low priority
  }

  private trackEvent(eventName: string, data: any) {
    // Send analytics data
  }
}
```

## Method Generator Patterns

### Dynamic API Client

```typescript
class DynamicAPIClient {
  private methodGenerator: any;
  private endpoints: Map<string, any> = new Map();

  constructor(instance: any) {
    this.methodGenerator = instance.MethodGenerator;
  }

  registerEndpoint(name: string, config: any) {
    // Note: bind method expects an array of configs
    this.methodGenerator.bind([{
      methodName: name,
      ...config
    }]);
    
    this.endpoints.set(name, config);
  }

  // Register multiple endpoints from configuration
  registerFromConfig(apiConfig: any) {
    const configs = Object.entries(apiConfig.endpoints).map(([name, config]) => ({
      methodName: name,
      ...config
    }));
    
    // Bind all configurations at once
    this.methodGenerator.bind(configs);
  }

  getMethods() {
    return this.methodGenerator.getMethods();
  }
}

// Usage
const apiClient = new DynamicAPIClient(instance);

const apiConfig = {
  endpoints: {
    getUsers: { method: "get", url: "/users" },
    createUser: { method: "post", url: "/users" },
    updateUser: { method: "put", url: "/users/:id" },
    deleteUser: { method: "delete", url: "/users/:id" }
  }
};

apiClient.registerFromConfig(apiConfig);
const methods = apiClient.getMethods();

// Now you can use dynamically generated methods
await methods.getUsers();
await methods.createUser({ name: "John" });
```

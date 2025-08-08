# EventBus

The `EventBus` is a built-in event management system that enables seamless communication between different components of your application. It provides a robust event-driven architecture with advanced features like priority handling, dependency resolution, and type-based event organization.

## Key Features

- **Priority System**: Execute event callbacks in a specific order based on priority levels
- **Dependency Management**: Ensure events are triggered only after their dependencies are resolved
- **Type-based Organization**: Categorize events for better structure and management
- **Flexible Subscription**: Subscribe/unsubscribe to events dynamically

## Event Types

EventBus supports three main event types for organized event handling:

| Event Type | Description | Use Case |
|------------|-------------|----------|
| `regular` | General-purpose events | Component communication, UI updates |
| `auth` | Authentication-related events | Login, logout, token refresh |
| `method` | HTTP method and API-related events | Request/response handling, API calls |

> [!note]
>
> For detailed type definitions and interfaces, please refer to:
> - [EventType Interface](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/eventBus.ts#L2)
> - [EventBus Implementation](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/utils/eventBus/EventBus.ts)

## Basic Usage

### Subscribe and Emit Events

```typescript
const eventBus = instance.EventBus;

// Define event handlers
const handleUserLogin = (userData: any) => {
  console.log("User logged in:", userData);
  // Update UI, save preferences, etc.
};

const handleDataFetch = (apiResponse: any) => {
  console.log("Data received:", apiResponse);
  // Process API response, update state, etc.
};

// Subscribe to different event types
eventBus.subscribe("userLogin", "auth", handleUserLogin);
eventBus.subscribe("dataFetched", "method", handleDataFetch);

// Emit events with data
eventBus.emit("userLogin", "auth", { 
  userId: 123, 
  username: "john_doe",
  email: "john@example.com" 
});

eventBus.emit("dataFetched", "method", { 
  status: 200, 
  data: [...], 
  timestamp: Date.now() 
});
```

### Unsubscribe from Events

```typescript
const eventBus = instance.EventBus;

const temporaryHandler = (data: any) => {
  console.log("Temporary event handler:", data);
};

// Subscribe to event
eventBus.subscribe("tempEvent", "regular", temporaryHandler);

// Later, unsubscribe when no longer needed
eventBus.unsubscribe("tempEvent", "regular", temporaryHandler);

// This event will not trigger the handler
eventBus.emit("tempEvent", "regular", "some data");
```

## Advanced Features

### Priority-based Event Execution

Events with higher priority values execute first. This is useful for ensuring critical operations happen before others.

```typescript
const eventBus = instance.EventBus;

const criticalHandler = (data: any) => {
  console.log("Critical handler (Priority: 3):", data);
};

const importantHandler = (data: any) => {
  console.log("Important handler (Priority: 2):", data);
};

const normalHandler = (data: any) => {
  console.log("Normal handler (Priority: 1):", data);
};

// Subscribe with different priorities
eventBus.subscribe("processData", "method", criticalHandler, 3);
eventBus.subscribe("processData", "method", importantHandler, 2);
eventBus.subscribe("processData", "method", normalHandler, 1);

// All handlers will execute in priority order: 3 → 2 → 1
eventBus.emit("processData", "method", { payload: "important data" });
```

### Event Dependencies

Ensure certain events are triggered before others, creating a dependency chain.

```typescript
const eventBus = instance.EventBus;

// Dependency event handler
const initializeApp = (config: any) => {
  console.log("App initialized with config:", config);
  // Perform initialization tasks
};

// Dependent event handler
const startUserSession = (userData: any) => {
  console.log("User session started:", userData);
  // This will only execute after 'appInitialized' event
};

// Subscribe to dependency
eventBus.subscribe("appInitialized", "regular", initializeApp);

// Subscribe with dependency requirement
eventBus.subscribe("userSessionStart", "auth", startUserSession, 0, ["appInitialized"]);

// Trigger the dependent event - this will automatically trigger 'appInitialized' first
eventBus.emit("userSessionStart", "auth", { userId: 123, sessionId: "abc123" });
```

## Event Management

### Clear Specific Events

```typescript
const eventBus = instance.EventBus;

const handler1 = (data: any) => console.log("Handler 1:", data);
const handler2 = (data: any) => console.log("Handler 2:", data);

// Subscribe multiple handlers
eventBus.subscribe("dataUpdate", "method", handler1);
eventBus.subscribe("dataUpdate", "method", handler2);
eventBus.subscribe("userAction", "regular", handler1);

// Clear all handlers for specific event and type
eventBus.clear("method", "dataUpdate");

// Only 'userAction' events will work now
eventBus.emit("dataUpdate", "method", "data"); // No output
eventBus.emit("userAction", "regular", "data"); // Handler 1 executes
```

### Clear All Events by Type

```typescript
const eventBus = instance.EventBus;

// Subscribe to multiple events of different types
eventBus.subscribe("login", "auth", (data) => console.log("Login:", data));
eventBus.subscribe("logout", "auth", (data) => console.log("Logout:", data));
eventBus.subscribe("apiCall", "method", (data) => console.log("API:", data));
eventBus.subscribe("uiUpdate", "regular", (data) => console.log("UI:", data));

// Clear all 'auth' type events
eventBus.clearType("auth");

// Only 'method' and 'regular' events will work
eventBus.emit("login", "auth", "data");     // No output
eventBus.emit("apiCall", "method", "data"); // Executes
eventBus.emit("uiUpdate", "regular", "data"); // Executes
```

### Clear All Events

```typescript
const eventBus = instance.EventBus;

// Subscribe to various events
eventBus.subscribe("event1", "regular", (data) => console.log("Event 1"));
eventBus.subscribe("event2", "auth", (data) => console.log("Event 2"));
eventBus.subscribe("event3", "method", (data) => console.log("Event 3"));

// Clear everything
eventBus.clearAll();

// No events will trigger
eventBus.emit("event1", "regular", "data"); // No output
eventBus.emit("event2", "auth", "data");    // No output
eventBus.emit("event3", "method", "data");  // No output
```

# **EventBus**

`EventBus` is a built-in event system that lets you communicate between different parts of your application. It’s especially useful for sharing data or triggering messages between independent modules.

### Features

- **Priority:** You can control the order of event execution.
- **Dependency:** You can make one event wait for another to be executed first.

### Event Types

- **regular:** General-purpose events  
- **auth:** Authentication-related events  
- **method:** HTTP or utility function-related events  

> **For type definitions:**  
> [EventType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/eventBus.ts#L2)  
> [EventBus](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/utils/eventBus/EventBus.ts)

---

## 🔔 Basic Usage

### Subscribe and Emit

```ts
const eventBus = instance.EventBus;

const regularCallback = (data) => console.log("Regular:", data);
const authCallback = (data) => console.log("Auth:", data);

eventBus.subscribe("helloEvent", "regular", regularCallback);
eventBus.subscribe("loginEvent", "auth", authCallback);

eventBus.emit("helloEvent", "regular", "Hello!");
eventBus.emit("loginEvent", "auth", "Logged in");
```

### Unsubscribe

```ts
const callback = (data) => console.log("Method:", data);

eventBus.subscribe("saveData", "method", callback);
eventBus.unsubscribe("saveData", "method", callback);

eventBus.emit("saveData", "method", "Should not log");
```

## Advanced Usage

### Priority Events

```ts
eventBus.subscribe("multiEvent", "regular", () => console.log("Priority 1"), 1);
eventBus.subscribe("multiEvent", "regular", () => console.log("Priority 0"), 0);

eventBus.emit("multiEvent", "regular", null);
// Output order: Priority 0 → Priority 1
```

### Dependent Events

```ts
eventBus.subscribe("step1", "auth", () => console.log("Step 1"));
eventBus.subscribe("step2", "auth", () => console.log("Step 2"), 0, ["step1"]);

eventBus.emit("step2", "auth", null);
// Step 1 runs first, then Step 2
```

## 🧹 Cleanup Options

### Clear a Specific Event

```ts
eventBus.clear("method", "saveData");
```

### Clear All Events by Type

```ts
eventBus.clearType("regular");
```

### Clear All Events

```ts
eventBus.clearAll();
```
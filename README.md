<h1 align="center"><img alt="api-client" src="https://github.com/abdulkadirkaradas/api-client/raw/develop/.github/header.jpg" style="max-width:50rem"></h1>

<p align="center">Simple API Client package based on <a href="https://github.com/axios/axios" target="_blank">axios</a>. Types included.</p>

# Features

- [x] **TypeScript Support**: Fully typed with TypeScript for better development experience.
- [x] **Types(.d.ts)**: Provides type definitions for all API methods and responses.
- [x] **API Client**: A simple and flexible API client based on axios.
- [x] **Authorization Service**: Handles authorization and token management.
- [x] **Storage Service**: Provides built-in local, session and cookie storage management.
- [x] **Interceptor Service**: Handles request and response interceptors for API calls.
- [x] **Method Generator**: Generates API methods based on the provided configuration.
- [x] **Built-in EventBus**: Provides a simple event bus for communication between components.
- [x] **Error Handling**: Provides a consistent way to handle errors across the application.
- [x] **Well Documented**: Comprehensive documentation with examples and usage instructions.
- The services currently only support the browser environment. Node.js support will be added in the future.

# Documentation

## Example

Moodo API Client aims to provide developers with a pre-configured approach to basic `Authorization` processes.

The basic configuration settings and a usage example are as follows:

### Instance Creation

> [!note]
>
> The `authProtocol` property is required. This property essentially determines whether the `Authorization Service` will process `access` and `refresh` tokens. The `authProtocol` property has two sub-properties, namely `useAuthProtocol` and `useOAUTHProtocol`. The `useAuthProtocol` property specifies whether authorization operations will return any token (JWT Token, OAUTH Token, etc.). `useOAUTHProtocol` specifies whether it will return a refresh token.

> [!warning]
> 
> If `authProtocol` property is not configured correctly, tokens will not be stored and used properly!

```typescript
import { createAPIClient } from "moodo";

const instance = new createAPIClient({
  authProtocol: {
    useAuthProtocol: true,
    useOAUTHProtocol: true,
  },
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});
```

<hr>

The API Client `instance` provides certain features for use with the API Client.

- **API Client**: The API Client instance provides a simple and flexible API client based on axios. You can use it to make API calls and handle responses.
- **Method Generator**: The Method Generator facade provides a method generator that allows you to create API methods based on the provided configuration. This is useful for generating methods for different API endpoints and HTTP methods.
- **Services**: The Services facade provides access to various services such as `Authorization`, `Storage`, and `Interceptor` services. These services can be used to handle authorization, storage, and request/response interceptors for API calls.
- **Storages**: The Storages facade provides built-in storage management for local, session, and cookie storage. This allows you to easily manage data in the browser's storage.
- **EventBus**: The EventBus provides a built-in event bus that allows you to communicate between different components of your application. This is useful for handling events and notifications across your application.

<br>

### **API Client**

The API Client instance directly accesses only the `Methods` and `InterceptorService` compositions, which contain the basic methods. To provide ease of use, the remaining services and properties are abstracted from the API Client instance.
When developers want to use the basic functions, they can directly interact with the methods through the instance and perform certain operations with the interceptors.

#### **Methods**

The `Methods` composition provides a set of methods for making API calls. You can use these methods to perform various HTTP operations such as GET, POST, PUT, DELETE PATCH, and HEAD.

```typescript
const apiClient = instance.apiClient;

instance.methods
  .post("/endpoint", { data: "example" })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

#### **InterceptorService**

The `InterceptorService` composition provides methods for adding request and response interceptors to the API client. This allows you to modify requests and responses before they are sent or received.

##### **Request Interceptor;**

The `setHeaders` method allows to directly assign request headers using a request interceptor. Developers can manually add the Access Token to the request headers without using the AuthorizationService.

```typescript
const interceptorService = instance.interceptorService;

interceptorService.request.setHeaders({
  Authorization: `Bearer ${authToken}`,
});
```

##### **Response Interceptor;**

The ResponseInterceptor facade has automatic token refresh and re-try structures.
The re-try structure re-tries the request a specified number of times when it receives 500, 502, and 503 error codes.

###### **Re-try Structure**

Related Code: [maxRetriesMap](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interceptors/responseInterceptors.ts#L38)

```typescript
// Map of HTTP status codes to the maximum number of retries allowed.
private maxRetriesMap: Record<number, number> = {
    500: 3, // 3 retries for Internal Server Error.
    502: 5, // 5 retries for Bad Gateway.
    503: 5, // 5 retries for Service Unavailable.
};
```

###### **Automatic Token Refresh Structure**

Automatic token refresh structure, if the request returned from the API returns 401, it automatically refreshes the token if the appropriate configurations are made.

Related Code: [Token Refresh Structure](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interceptors/responseInterceptors.ts#L109)

> [!warning]
>
> A token refresh endpoint is required for the automatic token refresh structure to function. If it is not provided, the corresponding error will be thrown.

```typescript
interceptorService.response.setTokenRefreshConfig({
  url: config.url,
});
```

### **Method Generator**

The `Method Generator` is a powerful feature that allows you to create API methods based on the provided configuration. This is useful for generating methods for different API endpoints and HTTP methods.

> [!note]
>
> - `methodName` property is required. This property is used to identify the generated method and should be unique for each method.
> - Also configurations can be provided from an external file.

```typescript
const methodGenerator = instance.MethodGenerator;
const config = {
  methodName: "getUser",
  method: "get",
  url: "/endpoint",
  params: {
    id: 123,
  },
  // Axios Request Configurations can be provided here.
  config: { ... }
};

methodGenerator.bind(config);

const methods = methodGenerator.getMethods();

methods
  .getUser()
  .then(function (result) {
    console.log(result.data);
  })
  .catch(function (result) {
    console.error(result);
  });
```

### **Services**

The `Services` facade provides access to various services such as `Authorization`, `Storage`, and `Interceptor` services. These services can be used to handle authorization, storage, and request/response interceptors for API calls.

#### **AuthorizationService**

The `AuthorizationService` is responsible for handling authorization and token management. It provides methods for setting and getting tokens, as well as checking if the user is authenticated.
Contains built-in `login`, `register`, `logout`, and `refreshToken` methods.

> [!note]
>
> The `AuthorizationService` is not directly accessible from the API Client instance. It is abstracted and can be accessed through the `Services` facade.

> [!note]
>
> The `AuthorizationService` methods require the 'tokenConfig' property to be provided in order to manage token operations. This property can be provided directly when creating the API Client instance initially, or it can be provided with `setTokenConfig()` function of service. If it is not provided, the service cannot manage token operations and will only make calls and return responses.

> [!note]
>
> For checking types and interfaces, please refer to the following files:
> <br>
> See; [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storage.ts#L1)
> <br>
> See; [AuthorizationServiceConfig](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/auth.ts#L5)

Token Configuration setting initially;

```typescript
import { createAPIClient } from "moodo";

const instance = new createAPIClient({
  authProtocol: {
    useAuthProtocol: true,
    useOAUTHProtocol: true,
  },
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
  // Token configuration can be initially provided here
  tokenConfig: {
    requestTokenConfig: {
      accessTokenName: "access_token",
      refreshTokenName: "refresh_token",
    },
    // See; interfaces/storage.ts: StorageType
    tokenStorageType: {
      accessToken: "localStorage",
      refreshToken: "localStorage",
    },
  },
});
```

Token Configuration setting with `setTokenConfig()` function;

```typescript
const authService = instance.Services.client.auth;

authService.setTokenConfig({
  requestTokenConfig: {
    // These names are used to identify the tokens in the request headers.
    // They are used to extract the tokens from the request headers and store them in the storage.
    // These names should match the names used in the API requests.
    // These name properties value configuration is user-specific. It does not have a default value.
    // If not provided, functions will not work properly.
    accessTokenName: "access_token",
    refreshTokenName: "refresh_token",
  },
  // See; interfaces/storage.ts: StorageType
  tokenStorageType: {
    accessToken: "localStorage",
    refreshToken: "localStorage",
  },
});
```

Login method example;

```typescript
const authService = instance.Services.client.auth;

let config: AuthorizationServiceConfig = {
  url: "/auth/login",
  data: {
    email: "usr@mail.com",
    password: "pwd",
  },
};

authService.login(config).then(function (result) {
  console.log(result.data);
});
```

Register method example;

```typescript
const authService = instance.Services.client.auth;

let config: AuthorizationServiceConfig = {
  url: "/users/",
  data: {
    name: "Test User",
    email: "test@mail.com",
    password: "1234",
    avatar: "url::to/avatar",
  },
};

authService.register(config).then(function (result) {
  console.log(result.data);
});
```

Logout method example;

```typescript
const authService = instance.Services.client.auth;

authService.logout({ url: "/auth/logout" }).then(function (result) {
  console.log(result.data);
});
```

Refresh token method example;

```typescript
const authService = instance.Services.client.auth;

let config: AuthorizationServiceConfig = {
  url: "/auth/refresh-token",
  data: {
    refreshToken: "string",
  },
};

authService.refreshToken(config).then(function (result) {
  console.log(result.data);
});
```

#### **Storage creation and access in the ClientService**

The ClientServices storage management structure differs from Storages facade. ClientServices can create and manage storage with multiple types simultaneously. It works compatibly with `AuthorizationService`.

```typescript
const clientService = instance.Services.client;

// Set storage types for the ClientService
clientService.setStorageType({
  testStorage1: "localStorage",
  testStorage2: "sessionStorage",
  testStorage3: "cookie",
});

// Create storages with the specified types
const storage1 = clientService.getStorage("testStorage1");
const storage2 = clientService.getStorage("testStorage2");
const storage3 = clientService.getStorage("testStorage3");

// Set data in the storages
storage1.set("key1", "value1");
storage2.set("key2", "value2");
storage3.set("key3", "value3");

// Get data from the storages
const value1 = storage1.get("key1");
const value2 = storage2.get("key2");
const value3 = storage3.get("key3");

// Remove data from the storages
storage1.remove("key1");
storage2.remove("key2");
storage3.remove("key3");

// Clear all data from the storages
storage1.clear();
storage2.clear();
storage3.clear();
```

#### **StorageService**

The `StorageService` facade provides built-in local, session, and cookie storage management. This allows you to easily manage data in the browser's storage.

> [!note]
>
> For checking types and interfaces, please refer to the following files:
> <br>
> See; [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storage.ts#L1)

```typescript
import { ClientStorageService } from "moodo";

const storageService = new ClientStorageService();

// See; interfaces/storage.ts: StorageType
const storage = storageService.createStorage("localStorage");

storage.set("key", "value");
const value = storage.get("key");
storage.remove("key");
storage.clear();
```

### **EventBus**

The `EventBus` is a built-in event bus that allows you to communicate between different components of your application. This is useful for handling events and notifications across your application.
<br>
EventBus has a priority and dependency structure. The priority structure allows you to set the priority of the events. 
The dependency structure allows you to set the dependencies of the events. This is useful for handling complex event flows and ensuring that events are processed in the correct order.

> [!note]
>
> EventBus have mainly 3 types of events: `regular`, `auth`, and `method`.
>
> - `regular`: Regular events that can be used for general purpose event handling.
> - `auth`: Events that are related to authentication and authorization processes.
> - `method`: Events that are related to the HTTP methos, common functions etc.
> - These events aims to provide a more organized and structured way to handle events in the application.

> [!note]
>
> For checking types and interfaces, please refer to the following files:
> <br>
> See; [EventType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/eventBus.ts#L2)
> <br>
> See; [EventBus](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/utils/eventBus/EventBus.ts)

Subscribe to an event;

```typescript
const eventBus = instance.EventBus;

const callback1 = (data: any) => {
  console.log("Regular event triggered with data:", data);
};
const callback2 = (data: any) => {
  console.log("Auth event triggered with data:", data);
};

eventBus.subscribe("testRegular", "regular", callback1);
eventBus.subscribe("testAuth", "auth", callback2);

eventBus.emit("testRegular", "regular", "regularData");
eventBus.emit("testAuth", "auth", "authData");
```

Unsubscribe from an event;

```typescript
const eventBus = instance.EventBus;

const callback1 = (data: any) => {
  console.log("Method event triggered with data:", data);
};

eventBus.subscribe("testEvent", "method", callback1);

eventBus.unsubscribe("testEvent", "method", callback1);

eventBus.emit("testEvent", "method", "data");
```

Subscribe to an event with priority;

```typescript
const eventBus = instance.EventBus;

const callback1 = (data: any) => {
  console.log("Regular event triggered with data:", data);
};
const callback2 = (data: any) => {
  console.log("Auth event triggered with data:", data);
};
const callback3 = (data: any) => {
  console.log("Method event triggered with data:", data);
};

eventBus.subscribe("testEvent", "regular", callback1, 1);
eventBus.subscribe("testEvent", "auth", callback2, 2);
eventBus.subscribe("testEvent", "method", callback3, 0);

eventBus.emit("testEvent", "regular", "data");
```

Subscribe to an event with dependencies;

```typescript
const eventBus = instance.EventBus;

const dependency = (data: any) => {
  console.log("Dependency event triggered with data:", data);
};
const callback1 = (data: any) => {
  console.log("auth event triggered with data:", data);
};

eventBus.subscribe("dependencyEvent", "auth", dependency);
eventBus.subscribe("testEvent", "auth", callback1, 0, ["dependencyEvent"]);

eventBus.emit("testEvent", "auth", "data");
```

Clear all events for a specific event name and type;

```typescript
const eventBus = instance.EventBus;

const callback1 = (data: any) => {
  console.log("Method event triggered with data:", data);
};

eventBus.subscribe("testEvent", "method", callback1);
eventBus.clear("method", "testEvent");

eventBus.emit("testEvent", "method", "data");
```

Clear all events for a specific type;

```typescript
const eventBus = instance.EventBus;

const callback1 = (data: any) => {
  console.log("Regular event triggered with data:", data);
};
const callback1 = (data: any) => {
  console.log("Auth event triggered with data:", data);
};

eventBus.subscribe("testEvent", "regular", callback1);
eventBus.subscribe("testAuth", "auth", callback2);
eventBus.clearType("regular");

eventBus.emit("testEvent", "regular", "data");
eventBus.emit("testAuth", "auth", "data");
```

Clear all events for all types;

```typescript
const eventBus = instance.EventBus;

const callback1 = (data: any) => {
  console.log("Method event triggered with data:", data);
};
const callback1 = (data: any) => {
  console.log("Auth event triggered with data:", data);
};

eventBus.subscribe("testEvent", "method", callback1);
eventBus.subscribe("testAuth", "auth", callback2);
eventBus.clearAll();

eventBus.emit("testEvent", "method", "data");
eventBus.emit("testAuth", "auth", "data");
```
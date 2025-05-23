# Client Services

The `ClientServices` structure is essentially designed to organize and clarify all the services that will run on the browser side, making them tidy, structured, and easy to understand.

## Authorization Service

The `AuthorizationService` helps you handle user authentication: **login**, **register**, **logout**, and **refresh token**. It also manages storing and using tokens.

### 🔐 Setup Token Configuration

You must provide `tokenConfig` to enable token operations. You can do this either:

1. When initializing the API client:

```ts
import { moodo } from "moodo";

const instance = new moodo({
  baseURL: "https://api.example.com",
  authProtocol: {
    useAuthProtocol: true,
    useOAUTHProtocol: true,
  },
  headers: {
    "Content-Type": "application/json",
  },
  tokenConfig: {
    requestTokenConfig: {
      accessTokenName: "access_token",
      refreshTokenName: "refresh_token",
    },
    tokenStorageType: {
      accessToken: "localStorage",
      refreshToken: "localStorage",
    },
  },
});

```

2. Later using `setTokenConfig()`:

```ts
const authService = instance.Services.client.auth;

authService.setTokenConfig({
  requestTokenConfig: {
    accessTokenName: "access_token",
    refreshTokenName: "refresh_token",
  },
  tokenStorageType: {
    accessToken: "localStorage",
    refreshToken: "localStorage",
  },
});
```

### ✅ Authentication Methods

#### Login

```ts
const authService = instance.Services.client.auth;

authService.login({
  url: "/auth/login",
  data: {
    email: "user@mail.com",
    password: "yourPassword",
  },
}).then(res => console.log(res.data));

```

#### Register

```ts
authService.register({
  url: "/users/",
  data: {
    name: "John Doe",
    email: "user@mail.com",
    password: "1234",
    avatar: "https://example.com/avatar.jpg",
  },
}).then(res => console.log(res.data));
```

#### Logout

```ts
authService.logout({
  url: "/auth/logout",
}).then(res => console.log(res.data));
```

#### Refresh Token

```ts
authService.refreshToken({
  url: "/auth/refresh-token",
  data: {
    refreshToken: "your_refresh_token",
  },
}).then(res => console.log(res.data));
```

### 🗃️ Storage Management

```ts
const clientService = instance.Services.client;

const storages = clientService.createStorages({
  local: { type: "localStorage" },
  session: { type: "sessionStorage" },
  cookie: { type: "cookie" },
});

// Example usage:
const storage = storages.local;

storage.set("key", "value");
console.log(storage.get("key")); // "value"
storage.remove("key");
storage.clear();
```

### 📎 Notes

- The `AuthorizationService` methods require the 'tokenConfig' property to be provided in order to manage token operations. This property can be provided directly when creating the API Client instance initially, or it can be provided with `setTokenConfig()` function of service. If it is not provided, the service cannot manage token operations and will only make calls and return responses.
- The `AuthorizationService` is not directly accessible from the API Client instance. It is abstracted and can be accessed through the `Services` facade.
- For type definitions, see:
    - [WebStorageType](https://github.com/abdulkadirkaradas/moodo/blob/develop/src/interfaces/storage.ts#L1)
    - [AuthorizationServiceConfig](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/auth.ts#L5)

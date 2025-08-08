# Authorization Service

The `AuthorizationService` is responsible for handling authorization and token management. It provides methods for setting and getting tokens, as well as checking if the user is authenticated. Contains built-in `login`, `register`, `logout`, and `refreshToken` methods.

> [!note]
>
> The `AuthorizationService` is not directly accessible from the API Client instance. It is abstracted and can be accessed through the `Services` facade.

> [!note]
>
> The `AuthorizationService` methods require the `tokenConfig` property to be provided in order to manage token operations. This property can be provided directly when creating the API Client instance initially, or it can be provided with `setTokenConfig()` function of service. If it is not provided, the service cannot manage token operations and will only make calls and return responses.

> [!note]
>
> For checking types and interfaces, please refer to the following files:
> - [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storage.ts#L1)
> - [AuthorizationServiceConfig](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/auth.ts#L5)

## Token Configuration

### Setting Initially

```typescript
import { moodo } from "moodo";

const instance = new moodo({
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

### Setting with Helper Function

```typescript
const authService = instance.Services.client.auth;

authService.setTokenConfig({
  requestTokenConfig: {
    // Token names used to identify and extract tokens from request headers.
    // They must match the names used in API requests.
    // These properties are user-specific and have no default value.
    // If not provided, token functions will not work properly.
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

## Methods

### Login

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

### Register

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

### Logout

```typescript
const authService = instance.Services.client.auth;

authService.logout({ url: "/auth/logout" }).then(function (result) {
  console.log(result.data);
});
```

### Refresh Token

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

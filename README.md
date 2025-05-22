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

## Installation

Add package dependency;

```bash
npm i moodo

```

Add package as a devDependecy;

```bash
npm i --save-dev moodo

```

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
});
```

<hr>

The API Client `instance` provides certain features for use with the API Client.

- **API Client**: The API Client instance provides a simple and flexible API client based on axios. You can use it to make API calls and handle responses.
- **Method Generator**: The Method Generator facade provides a method generator that allows you to create API methods based on the provided configuration. This is useful for generating methods for different API endpoints and HTTP methods.
- **Services**: The Services facade provides access to various services such as `Authorization`, `Storage`, and `Interceptor` services. These services can be used to handle authorization, storage, and request/response interceptors for API calls.
- **Storages**: The Storages facade provides built-in storage management for local, session, and cookie storage. This allows you to easily manage data in the browser's storage.
- **EventBus**: The EventBus provides a built-in event bus that allows you to communicate between different components of your application. This is useful for handling events and notifications across your application.

## Features & Documentation

- **API Client**: See [src/core/README.md](src/core/README.md)
- **Authorization & Storage Service**: See [src/core/services/client/README.md](src/core/services/client/README.md)
- **Interceptors**: See [src/interceptors/README.md](src/interceptors/README.md)
- **Method Generator**: See [src/methods/README.md](src/methods/README.md)
- **StorageService**: See [src/utils/storage/client/README.md](src/utils/storage/client/README.md)
- **EventBus**: See [src/utils/eventBus/README.md](src/utils/eventBus/README.md)

Each folder contains a detailed, clear README with usage and examples for that feature.
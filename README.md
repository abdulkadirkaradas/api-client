<h1 align="center"><img alt="api-client" src="https://github.com/abdulkadirkaradas/api-client/raw/develop/.github/header.jpg" style="max-width:50rem"></h1>

<p align="center">Simple API Client package based on <a href="https://github.com/axios/axios" target="_blank">axios</a>. Types included.</p>

# Features

- [x] **TypeScript Support**: Fully typed with TypeScript for better development experience.
- [x] **Types(.d.ts)**: Provides type definitions for all API methods and responses.
- [x] **API Client**: A simple and flexible API client based on axios.
- [x] **Authorization Service**: Handles authorization and token management.
- [x] **Storage Service**: Provides built-in storage management for web and node environments.
- [x] **Redis Service**: Provides built-in Redis storage management and basic Redis service.
- [x] **Interceptor Service**: Handles request and response interceptors for API calls.
- [x] **Method Generator**: Generates API methods based on the provided configuration.
- [x] **Built-in EventBus**: Provides a simple event bus for communication between components.
- [x] **Error Handling**: Provides a consistent way to handle errors across the application.
- [x] **Well Documented**: Comprehensive documentation with examples and usage instructions.
- The services supports both `browser` and `node` environments.

# Quick Start

## Installation

```bash
npm i moodo
```

## Basic Usage

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

// Make API calls
instance.methods
  .post("/endpoint", { data: "example" })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## Core Components

The API Client `instance` provides access to several powerful features:

- **[API Client](./docs/api-client.md)**: HTTP methods and request/response interceptors
- **[Method Generator](./docs/method-generator.md)**: Dynamic API method creation from configuration
- **[Authorization Service](./docs/authorization.md)**: Token management and authentication workflows
- **[Storage Service](./docs/storage.md)**: Cross-platform storage solutions (localStorage, Redis, File, etc.)
- **[EventBus](./docs/eventbus.md)**: Event-driven communication with priority and dependency support

## Documentation

### Getting Started
- **[Quick Start Guide](./docs/examples/quick-start.md)** - Get up and running in minutes
- **[Advanced Usage](./docs/examples/advanced-usage.md)** - Complex patterns and use cases

### Core Features
- **[API Client](./docs/api-client.md)** - HTTP methods, interceptors, and request handling
- **[Authorization](./docs/authorization.md)** - Authentication, token management, and security
- **[Storage](./docs/storage.md)** - Data persistence across web and Node.js environments
- **[EventBus](./docs/eventbus.md)** - Event-driven architecture and component communication
- **[Method Generator](./docs/method-generator.md)** - Dynamic API method generation

### Configuration

> [!note]
>
> The `authProtocol` property is optional. This property essentially determines whether the `Authorization Service` will process `access` and `refresh` tokens.
>
> By default, the `useAuthProtocol` property is set to `true`, and `useOAUTHProtocol` is set to `false`. If a refresh token needs to be stored, the `useOAUTHProtocol` property should be set to `true`.

> [!warning]
>
> If `authProtocol` property is not configured correctly, tokens will not be stored and used properly!

For detailed configuration options and advanced usage patterns, please refer to the specific documentation files linked above.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the develop branch.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

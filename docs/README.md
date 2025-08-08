# Documentation Index

This directory contains comprehensive documentation for Moodo API Client. The documentation is organized into focused modules for better readability and maintenance.

## Core Documentation

### API Features
- **[API Client](./api-client.md)** - HTTP methods, interceptors, and request handling
- **[Authorization](./authorization.md)** - Authentication, token management, and security
- **[Storage](./storage.md)** - Data persistence across web and Node.js environments
- **[Redis Service](./redis-service.md)** - High-level Redis operations for caching, rate limiting, and queuing etc.
- **[EventBus](./eventbus.md)** - Event-driven architecture and component communication
- **[Method Generator](./method-generator.md)** - Dynamic API method generation

### Examples and Guides
- **[Quick Start Guide](./examples/quick-start.md)** - Get up and running in minutes
- **[Advanced Usage](./examples/advanced-usage.md)** - Complex patterns and use cases

## Quick Navigation

### For Beginners
1. Start with [Quick Start Guide](./examples/quick-start.md)
2. Read [API Client](./api-client.md) for basic HTTP operations
3. Explore [Authorization](./authorization.md) for authentication setup

### For Advanced Users
1. Check [Advanced Usage](./examples/advanced-usage.md) for complex patterns
2. Dive into [EventBus](./eventbus.md) for event-driven architecture
3. Use [Redis Service](./redis-service.md) for caching and rate limiting
4. Use [Method Generator](./method-generator.md) for dynamic API methods

### Platform-Specific
- **Web Applications**: Focus on localStorage, sessionStorage, and cookie storage
- **Node.js Applications**: Explore Redis, file, and memory storage options
- **Cross-Platform**: Use the EventBus for component communication

## File Structure

```
docs/
├── README.md               # This index file
├── api-client.md           # HTTP methods and interceptors
├── authorization.md        # Authentication and token management
├── storage.md              # Storage solutions (localStorage, Redis, etc.)
├── redis-service.md        # High-level Redis operations
├── eventbus.md             # Event-driven communication
├── method-generator.md     # Dynamic API method creation
└── examples/
    ├── quick-start.md      # Getting started guide
    └── advanced-usage.md   # Complex usage patterns
```

## Contributing to Documentation

When adding new documentation:

1. Keep each file focused on a single feature or concept
2. Include practical code examples
3. Add cross-references to related documentation
4. Update this index file with new additions
5. Follow the established markdown formatting conventions

## Getting Help

- Check the specific feature documentation for detailed information
- Look at the examples directory for practical use cases
- Refer to the main README.md for quick setup instructions
- Check the source code comments for implementation details

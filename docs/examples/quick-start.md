# Quick Start Guide

This guide will help you get started with Moodo API Client quickly.

## Installation

```bash
npm i moodo
```

## Basic Setup

```typescript
import { moodo } from "moodo";

const instance = new moodo({
  baseURL: "https://api.example.com",
  headers: {
    "Content-Type": "application/json",
  },
});
```

## Making Your First API Call

```typescript
const methods = instance.methods;

// Simple GET request
methods
  .get("/users")
  .then((response) => {
    console.log("Users:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// POST request with data
methods
  .post("/users", {
    name: "John Doe",
    email: "john@example.com"
  })
  .then((response) => {
    console.log("User created:", response.data);
  });
```

## With Authentication

```typescript
const instance = new moodo({
  authProtocol: {
    useAuthProtocol: true,
    useOAUTHProtocol: true,
  },
  baseURL: "https://api.example.com",
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

// Login
const authService = instance.Services.client.auth;
await authService.login({
  url: "/auth/login",
  data: {
    email: "user@example.com",
    password: "password123"
  }
});

// Now all requests will include the authentication token automatically
```

## Next Steps

- [API Client Documentation](.././api-client.md) - Learn about HTTP methods and interceptors
- [Authorization Guide](.././authorization.md) - Complete authentication setup
- [Storage Options](.././storage.md) - Data persistence solutions
- [EventBus Usage](.././eventbus.md) - Component communication
- [Method Generator](.././method-generator.md) - Dynamic API method creation

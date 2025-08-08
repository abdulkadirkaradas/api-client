# Method Generator

The `Method Generator` is a powerful feature that allows you to create API methods based on the provided configuration. This is useful for generating methods for different API endpoints and HTTP methods.

> [!note]
>
> - `methodName` property is required. This property is used to identify the generated method and should be unique for each method.
> - Also configurations can be provided from an external file.

## Basic Usage

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

## Configuration Options

The method generator accepts various configuration options that align with Axios request configurations:

- `methodName`: Unique identifier for the generated method
- `method`: HTTP method (GET, POST, PUT, DELETE, etc.)
- `url`: API endpoint URL
- `params`: URL parameters
- `data`: Request body data
- `config`: Additional Axios configuration options

## Multiple Methods

You can bind multiple method configurations and use them together:

```typescript
const methodGenerator = instance.MethodGenerator;

// Define multiple methods
const configs = [
  {
    methodName: "getUsers",
    method: "get",
    url: "/users"
  },
  {
    methodName: "createUser",
    method: "post",
    url: "/users"
  },
  {
    methodName: "updateUser",
    method: "put",
    url: "/users/:id"
  }
];

// Bind all configurations
configs.forEach(config => methodGenerator.bind(config));

const methods = methodGenerator.getMethods();

// Use the generated methods
await methods.getUsers();
await methods.createUser({ name: "John", email: "john@example.com" });
await methods.updateUser({ id: 1, name: "John Updated" });
```

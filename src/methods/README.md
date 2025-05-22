# Methods

The `Methods` composition provides a set of methods for making API calls. You can use these methods to perform various HTTP operations such as GET, POST, PUT, DELETE PATCH, and HEAD.

```typescript
const apiClient = instance.apiClient;

apiClient.methods
  .post("/endpoint", { data: "example" })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## Method Generator

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
methods.getUser().then(res => console.log(res.data));
```

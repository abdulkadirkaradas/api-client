# API Client

The API Client instance directly accesses only the `Methods` and `InterceptorService` compositions, which contain the basic methods. To provide ease of use, the remaining services and properties are abstracted from the API Client instance.

## Methods

The `Methods` composition provides a set of methods for making API calls. You can use these methods to perform various HTTP operations such as GET, POST, PUT, DELETE PATCH, and HEAD.

```typescript
import { moodo } from "moodo";

const instance = new moodo({ ... });

instance.methods
  .post("/endpoint", { data: "example" })
  .then((response) => {
    console.log("Response:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
```

## InterceptorService

The `InterceptorService` composition provides methods for adding request and response interceptors to the API client. This allows you to modify requests and responses before they are sent or received.

### Request Interceptor

The `setHeaders` method allows to directly assign request headers using a request interceptor. Developers can manually add the Access Token to the request headers without using the AuthorizationService.

```typescript
const interceptorService = instance.interceptorService;

interceptorService.request.setHeaders({
  Authorization: `Bearer ${authToken}`,
});
```

### Response Interceptor

The ResponseInterceptor facade has automatic token refresh and re-try structures.
The re-try structure re-tries the request a specified number of times when it receives 500, 502, and 503 error codes.

#### Re-try Structure

Related Code: [maxRetriesMap](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interceptors/responseInterceptors.ts#L38)

```typescript
// Map of HTTP status codes to the maximum number of retries allowed.
private maxRetriesMap: Record<number, number> = {
    500: 3, // 3 retries for Internal Server Error.
    502: 5, // 5 retries for Bad Gateway.
    503: 5, // 5 retries for Service Unavailable.
};
```

#### Automatic Token Refresh Structure

Automatic token refresh structure, if the request returned from the API returns 401, it automatically refreshes the token if the appropriate configurations are made.

Related Code: [Token Refresh Structure](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interceptors/responseInterceptors.ts#L109)

> [!warning]
>
> A token refresh endpoint is required for the automatic token refresh structure to function. If it is not provided, the corresponding error will be thrown.
>
> Automatic token refresh structure requires the `AuthorizationService.login()` function to be called at least once. If it is not called, automatic token refresh will not be triggered.

**Setting token refresh endpoint;**

With the initial creation;

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
  // Token refresh endpoint can be provided here
  interceptor: {
    response: {
      tokenRefreshConfig: {
        url: "/auth/refresh-token",
      },
    },
  },
});
```

With the helper function;

```typescript
const client = instance.ApiClient;

client.interceptorService.response.setTokenRefreshConfig({
  url: config.url,
});
```

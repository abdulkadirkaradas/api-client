# Core

This folder contains the main API client and core service structure.

- `apiClient.ts`: Main API client entry.
- `services/`: Authorization, Storage, and Interceptor core services.

See also: [services/README.md](./services/README.md)

## API Client

The API Client instance directly accesses only the `Methods` and `InterceptorService` compositions, which contain the basic methods. To provide ease of use, the remaining services and properties are abstracted from the API Client instance.
When developers want to use the basic functions, they can directly interact with the methods through the instance and perform certain operations with the interceptors.

## Services
See the [services/README.md](./services/README.md) for more information about the services.

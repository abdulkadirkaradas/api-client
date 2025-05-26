# Server Storage

This module provides utilities for managing server-side storage options, including file storage, memory storage, and Redis storage. These utilities allow you to store, retrieve, remove, and clear data on the server.

## Supported Storage Types

- **FileStorage**: Stores data in files on the server's filesystem. Suitable for persistent storage needs.
- **MemoryStorage**: Stores data in server memory. Fast but volatile; data is lost when the server restarts.
- **RedisStorage**: Stores data in a Redis database. Suitable for distributed and scalable storage requirements.

## Usage

For usage details and examples, please refer to the documentations below;
- [`Node storage tests`](https://github.com/abdulkadirkaradas/moodo/tree/develop/tests/server/storage)
    - [`Test Setup`](https://github.com/abdulkadirkaradas/moodo/blob/develop/tests/utils/testSetup.ts)

## Notes

- All storage types share a similar API.
- For types and interfaces, see:
  - [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storages/storage.ts#L1)
  - [Redis Storage Types](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storages/redis.ts#L1)

---
For more information, refer to the main documentation or the relevant interface files.
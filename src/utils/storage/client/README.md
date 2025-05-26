# Client Storage

This module provides utilities for managing browser storage, including localStorage, sessionStorage, and cookieStorage. These utilities allow you to store, retrieve, remove, and clear data in the browser's storage.

## Supported Storage Types

- **localStorage**: Persistent data storage. Data remains after the browser is closed.
- **sessionStorage**: Temporary data storage. Data is cleared when the tab or browser is closed.
- **cookieStorage**: Data storage using cookies. Suitable for small and short-lived data.

## Usage

For usage details and examples, please refer to the documentations below;
- [`src/core/services/client/README.md`](https://github.com/abdulkadirkaradas/moodo/tree/develop/src/core/services/client#%EF%B8%8F-storage-management).
- [`Client storage tests`](https://github.com/abdulkadirkaradas/moodo/tree/develop/tests/client/storage)
    - [`Test Setup`](https://github.com/abdulkadirkaradas/moodo/blob/develop/tests/utils/testSetup.ts)


## Notes

- All storage types share a similar API.
- For types and interfaces, see:
  - [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storages/storage.ts#L1)

---
For more information, refer to the main documentation or the relevant interface files.
# StorageService

The `StorageService` facade provides built-in local, session, and cookie storage management. This allows you to easily manage data in the browser's storage.

> [!note]
>
> For checking types and interfaces, please refer to the following files:
> <br>
> See; [StorageType](https://github.com/abdulkadirkaradas/api-client/blob/develop/src/interfaces/storage.ts#L1)

```typescript
import { ClientStorageService } from "moodo";

const storageService = new ClientStorageService();

const storage = storageService.createStorage("web", "localStorage");

storage.set("key", "value");
const value = storage.get("key");
storage.remove("key");
storage.clear();
```
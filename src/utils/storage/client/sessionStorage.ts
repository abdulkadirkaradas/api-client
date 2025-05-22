import { BaseStorage } from "./baseStorage";

/**
 * SessionStorage is a utility class for managing data in the browser's session storage.
 * It implements the IStorage interface to provide a consistent API for storage operations.
 * Session storage persists data only for the duration of the page session.
 */
export class SessionStorage extends BaseStorage {
  storage = typeof window !== "undefined" ? window.sessionStorage : undefined;
}

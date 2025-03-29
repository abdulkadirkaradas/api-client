import { IStorage } from "../../../interfaces/storage";

/**
 * CookieStorage is a utility class for managing cookies in the browser.
 * It implements the IStorage interface to provide a consistent API for storage operations.
 */
export class CookieStorage implements IStorage {
  /**
   * Sets a cookie with the given key and value.
   * The cookie will expire after the specified number of days.
   * 
   * @param key {string} - The name of the cookie.
   * @param value {string} - The value to store in the cookie.
   * @param days {number} - The number of days until the cookie expires (default is 7 days).
   */
  public set(key: string, value: string, days: number = 7): void {
    // Create a new Date object to calculate the expiration time.
    const date = new Date();
     // Set the expiration time in milliseconds.
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
     // Convert the expiration time to a UTC string.
    const expires = "expires=" + date.toUTCString();
     // Set the cookie with the key, value, and expiration.
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
  }

  /**
   * Gets the value of the cookie with the given key.
   * If the cookie does not exist, it returns null.
   * 
   * @param key {string} - The name of the cookie to retrieve.
   * @returns {string | null} - The value of the cookie, or null if the cookie does not exist.
   */
  public get(key: string): string | null {
    // Prefix to match the cookie name.
    const name = key + "=";
    // Decode the cookie string to handle special characters.
    const decodedCookie = decodeURIComponent(document.cookie);
    // Split the cookie string into individual cookies.
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      // Get the current cookie.
      let c = ca[i];
      while (c.charAt(0) == " ") {
        // Remove leading spaces.
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        // Return the value of the matching cookie.
        return c.substring(name.length, c.length);
      }
    }
    // Return null if the cookie is not found.
    return null;
  }

  /**
   * Removes the cookie with the given key.
   * This is done by setting the cookie's expiration date to a past date.
   * 
   * @param key {string} - The name of the cookie to remove.
   */
  public remove(key: string): void {
    // Set the cookie with an empty value and a negative expiration time to delete it.
    this.set(key, "", -1);
  }

  /**
   * Clears all cookies by iterating through the document's cookies and removing each one.
   * Note: This method only clears cookies accessible from the current path and domain.
   */
  public clear(): void {
    // Split the cookie string into individual cookies.
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      // Find the position of the "=" character.
      const eqPos = cookie.indexOf("=");
      // Extract the cookie name.
      const key = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      // Remove the cookie by its name.
      this.remove(key.trim());
    }
  }
}

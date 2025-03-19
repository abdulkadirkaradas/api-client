import { IStorage } from "../../../interfaces/storage";

export class CookieStorage implements IStorage {
  /**
   * Sets a cookie with the given key and value
   * 
   * @param key 
   * @param value 
   * @param days 
   */
  public set(key: string, value: string, days: number = 7): void {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + date.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
  }

  /**
   * Gets the value of the cookie with the given key
   * 
   * @param key 
   */
  public get(key: string): string | null {
    const name = key + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  }

  /**
   * Removes the cookie with the given key
   * 
   * @param key 
   */
  public remove(key: string): void {
    this.set(key, "", -1);
  }

  public clear(): void {}
}

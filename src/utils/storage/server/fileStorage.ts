import * as fs from "fs";
import { IStorage } from "../../../interfaces/storages/storage";
import path from "path";

/**
 * FileStorage class implements the IStorage interface for file-based storage.
 * It provides methods to load, set, get, remove, and clear data from a JSON file.
 */
export class FileStorage implements IStorage {
  private filePath: string = "";
  private data: Record<string, string> = {};

  load(filePath: string): void {
    const resolvedPath = path.resolve(filePath);
    this.filePath = resolvedPath;

    if (!fs.existsSync(resolvedPath)) {
      this.data = {};
      return;
    }

    try {
      const fileContent = fs.readFileSync(resolvedPath, "utf-8");
      const parsed = JSON.parse(fileContent);
      if (typeof parsed === "object" && parsed !== null) {
        this.data = parsed;
      } else {
        this.data = {};
      }
    } catch (error) {
      console.error("Dosya yüklenirken hata oluştu:", error);
      this.data = {};
    }
  }

  set(key: string, value: string): void {
    this.data[key] = value;
    this.save();
  }

  get(key: string): string | null {
    return this.data[key] ?? null;
  }

  remove(key: string): void {
    delete this.data[key];
    this.save();
  }

  clear(): void {
    this.data = {};
    this.save();
  }

  private save(): void {
    try {
      fs.writeFileSync(
        this.filePath,
        JSON.stringify(this.data, null, 2),
        "utf-8"
      );
    } catch (error) {
      console.error("File write error:", error);
    }
  }
}

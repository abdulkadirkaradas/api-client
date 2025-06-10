import type { Config } from "jest";

const config: Config = {
  testEnvironment: "jsdom",
  testMatch: ["**/tests/**/**/*.test.ts"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  setupFilesAfterEnv: ["jest-localstorage-mock"],
  testPathIgnorePatterns: ["/src"],
  detectOpenHandles: true,
};

export default config;
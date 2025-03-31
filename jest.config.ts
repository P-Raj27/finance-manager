/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/en/configuration.html
 */
import { defaults as TsJest } from "ts-jest/presets/index";
export default {
  ...TsJest,
  clearMocks: true,
  testEnvironment: "node",
  testMatch: ["**/unitTests/*.spec.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^src/(.*)$": "<rootDir>/src/$1", // Added mapping for src/
    "^@functions/(.*)$": "<rootDir>/src/functions/$1", // Added mapping for @functions
    "^@libs/(.*)$": "<rootDir>/src/libs/$1", // Added mapping for @libs
  },

  transform: {
    ".ts$": ["ts-jest", { diagnostics: false }],
  },
};

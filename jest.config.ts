/**
 * https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
 */
import nextJest from "next/jest";
import type { Config } from "jest";


const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});

const customJestConfig: Config = {
    clearMocks: true,
    testEnvironment: "node",
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    testMatch: [
        "<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}",
    ],
    moduleDirectories: ['node_modules', '<rootDir>'],
    globalSetup: '<rootDir>/tests/setup.ts',
    globalTeardown: '<rootDir>/tests/teardown.ts',
    modulePathIgnorePatterns: ["<rootDir>/.next/"],
    transform: {}
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async

export default createJestConfig(customJestConfig);

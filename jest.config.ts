/**
 * https://nextjs.org/docs/testing#setting-up-jest-with-the-rust-compiler
 */
import nextJest from "next/jest";
import type {Config} from "jest";


const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: "./",
});


const customJestConfig: Config = {
    clearMocks: true,
    testEnvironment: 'node',
    coverageProvider: 'v8',
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    testMatch: [
        "<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}",
    ],
    moduleDirectories: ['node_modules', '<rootDir>'],
    globalSetup: '<rootDir>/tests/global-setup.ts',
    globalTeardown: '<rootDir>/tests/global-teardown.ts',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    modulePathIgnorePatterns: ["<rootDir>/.next/"],
    collectCoverage: true,
    collectCoverageFrom: ['pages/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}', 'lib/**/*.{ts,tsx}', 'server/**/*.{ts,tsx}'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async

const esModules = ["superjson", "uncrypto", "next-auth", "@auth/core", "oauth4webapi"];


export default createJestConfig(customJestConfig)().then(value => {
    value = {
        ...value,
        transformIgnorePatterns: [`/node_modules/(?!(${esModules.join("|")})/)`],
        moduleNameMapper: {...value.moduleNameMapper, '^next-auth(.*)$': '<rootDir>/node_modules/next-auth$1', '^@auth/core(.*)$': '<rootDir>/node_modules/@auth/core$1'}
    }
    // console.log(JSON.stringify(value))
    return value;
})

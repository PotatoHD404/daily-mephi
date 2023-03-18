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
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    testMatch: [
        "<rootDir>/tests/**/*.{spec,test}.{js,jsx,ts,tsx}",
    ],
    moduleDirectories: ['node_modules', '<rootDir>'],
    // testEnvironmentOptions: {
    //     DATABASE_URL: () => {
    //         return process.env.DATABASE_URL;
    //         // console.log(process.env.JEST_WORKER_ID)
    //         // const workerId = process.env.JEST_WORKER_ID;
    //         // if (!workerId) {
    //         //     throw new Error('JEST_WORKER_ID is not defined');
    //         // }
    //         // return generateDatabaseUrl(workerId).toString().trim();
    //     },
    // }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(customJestConfig);

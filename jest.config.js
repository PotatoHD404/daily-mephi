module.exports = {
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    testMatch: [
        "<rootDir>/tests/**/*.test.@(ts|js)"
    ],
    moduleDirectories: ['node_modules', '<rootDir>']
};

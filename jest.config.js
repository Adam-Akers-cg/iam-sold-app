const nextJest = require('next/jest')

const createJestConfig = nextJest({
    dir: './',
})

const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jsdom',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1', // ✅ correct alias (change to <rootDir>/src/$1 if you use a `src` folder)
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
}

module.exports = createJestConfig(customJestConfig)

process.on('warning', (warning) => {
    if (
        warning.name === 'DeprecationWarning' &&
        warning.message.includes('punycode')
    ) {
        // Ignore the punycode deprecation warning
    } else {
        console.warn(warning)
    }
})

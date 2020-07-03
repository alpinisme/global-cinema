module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: {
        '\\.scss$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['./resources/ts/tests/backend-helpers/setup-env.ts'],
};

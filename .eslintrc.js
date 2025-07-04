module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    rules: {
        'no-console': 'off',
        'max-classes-per-file': ['error', 20],
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'no-useless-constructor': 'off',
        'no-empty-function': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
    },
    extends: ['plugin:@typescript-eslint/recommended'],
};

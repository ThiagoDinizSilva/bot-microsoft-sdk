/* eslint-disable no-undef */
module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'plugin:prettier/recommended',
        'plugin:import/typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    plugins: ['prettier'],
    rules: {
        semi: [2, 'always'],
        indent: ['off'],
        'no-return-await': 0,
        'prettier/prettier': 'error',
        'space-before-function-paren': [
            0,
            {
                named: 'never',
                anonymous: 'never',
                asyncArrow: 'always',
            },
        ],
        'template-curly-spacing': [0, 'always'],
    },
};

module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: [
        '@typescript-eslint/eslint-plugin',
        'unicorn',
        '@darraghor/nestjs-typed',
    ],
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'plugin:unicorn/recommended',
        'plugin:@darraghor/nestjs-typed/recommended',
        'plugin:@darraghor/nestjs-typed/no-swagger',
    ],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: ['.eslintrc.js'],
    rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',

        'unicorn/filename-case': [
            'error',
            {
                cases: {
                    kebabCase: true,
                    pascalCase: true,
                },
            },
        ],
        'unicorn/prefer-top-level-await': 'off',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/no-null': 'off',
        'unicorn/no-static-only-class': 'off',
        'unicorn/prefer-module': 'off',
        'unicorn/prefer-node-protocol': 'off',

        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                trailingComma: 'all',
                tabWidth: 4,
                bracketSpacing: true,
                endOfLine: 'auto',
            },
        ],

        '@darraghor/nestjs-typed/api-property-returning-array-should-set-array':
            'off',
    },
};

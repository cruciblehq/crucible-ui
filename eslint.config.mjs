import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
    {
        ignores: [
            'node_modules/**',
            'dist/**',
        ],
    },
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                tsconfigRootDir: process.cwd(),
                project: ['./tsconfig.base.json'],
            },
        },
        plugins: {
            '@typescript-eslint': tseslint,
        },
        rules: {
            // TypeScript-specific rules
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            // Type safety
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-assignment': 'error',
            '@typescript-eslint/no-unsafe-call': 'error',
            '@typescript-eslint/no-unsafe-member-access': 'error',

            // Return types
            '@typescript-eslint/explicit-function-return-type': 'error',
            '@typescript-eslint/explicit-module-boundary-types': 'error',

            // Consistent type imports
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/consistent-type-exports': 'error',

            // Prevent floating promises
            '@typescript-eslint/no-floating-promises': 'error',

            // Prevent misused promises
            '@typescript-eslint/no-misused-promises': [
                'error',
                {
                    checksVoidReturn: false, // Allow async event handlers
                },
            ],

            // Naming conventions
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                },
                {
                    selector: 'typeAlias',
                    format: ['PascalCase'],
                },
                {
                    selector: 'enum',
                    format: ['PascalCase'],
                },
                {
                    selector: 'class',
                    format: ['PascalCase'],
                },
            ],

            // Console
            'no-console': ['warn', { allow: ['warn', 'error'] }],

            // Modern JS
            'prefer-const': 'error',
            'no-var': 'error',

            // Arrow functions
            'prefer-arrow-callback': 'error',
            'arrow-body-style': ['error', 'as-needed'],

            // Object/Array destructuring
            'prefer-destructuring': 'error',

            // Template literals
            'prefer-template': 'error',

            // Rest/spread
            'prefer-rest-params': 'error',
            'prefer-spread': 'error',

            // Equality
            'eqeqeq': ['error', 'always', { null: 'ignore' }],

            // No unnecessary code
            'no-else-return': 'error',
            'no-lonely-if': 'error',
            'no-useless-return': 'off',
            'no-useless-computed-key': 'error',
            'no-useless-rename': 'error',

            // Async/await
            'require-await': 'error',
            'no-return-await': 'error',

            // Prevent common errors
            'no-duplicate-imports': 'error',
            'no-self-compare': 'error',
            'no-template-curly-in-string': 'error',
            'no-unneeded-ternary': 'error',

            // Code style
            'object-shorthand': ['error', 'always'],
            'quote-props': ['error', 'as-needed'],
            'yoda': 'error',
        },
    },
];

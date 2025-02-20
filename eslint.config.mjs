import nx from '@nx/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';
import rxjsPlugin from 'eslint-plugin-rxjs';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules'],
  },
  {
    plugins: {
      unicorn,
      rxjs: rxjsPlugin,
      'simple-import-sort': simpleImportSort,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['tsconfig.base.json', 'apps/*/tsconfig.json', 'libs/*/tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      //  Angular-Specific Rules
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'app', style: 'kebab-case' },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'app', style: 'camelCase' },
      ],
      '@angular-eslint/no-conflicting-lifecycle': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-injectable-provided-in': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/no-output-on-prefix': 'error',
      '@angular-eslint/use-component-selector': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@typescript-eslint/prefer-readonly': 'error',

      'linebreak-style': ['error', 'unix'],

      // NestJS-Specific Rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      'linebreak-style': ['error', 'unix'],
      // NestJS Dependency Injection
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-extraneous-class': ['error', { allowWithDecorator: true }],

      // NestJS Controller & Service Structure
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',

      // Exception Handling & Promises
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      'unicorn/error-message': 'error',

      // Module & Provider Best Practices
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-explicit-any': 'error',

      // Import Sorting
      'simple-import-sort/imports': 'error',

      // Access Modifier Rules (For Both Angular & NestJS)
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/class-methods-use-this': 'warn',

      //  Import Order & Best Practices
      'simple-import-sort/imports': 'error',

      // Additional Best Practices
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'unicorn/prefer-ternary': 'warn',
    },
  },
  {
    files: ['**/*.spec.ts', '**/jest.config.ts', '**/test/**/*.ts'],
    languageOptions: {
      parser: (await import('@typescript-eslint/parser')).default,
      parserOptions: {
        project: ['tsconfig.base.json', 'apps/*/tsconfig.json', 'libs/*/tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      '@typescript-eslint/prefer-readonly': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/switch-exhaustiveness-check': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'rxjs/no-ignored-subscription': 'off',
    },
  },
];

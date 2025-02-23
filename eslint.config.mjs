import nx from '@nx/eslint-plugin';
import unicorn from 'eslint-plugin-unicorn';
import rxjsPlugin from 'eslint-plugin-rxjs';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import angularPlugin from '@angular-eslint/eslint-plugin';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import tsParser from '@typescript-eslint/parser';

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
      '@angular-eslint': angularPlugin,
      '@angular-eslint/template': angularTemplatePlugin,
    },
  },

  {
    files: ['apps/iaimc-backend/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['apps/iaimc-backend/tsconfig.app.json'],

        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'signature',
            'public-static-field',
            'protected-static-field',
            'private-static-field',
            'public-instance-field',
            'protected-instance-field',
            'private-instance-field',
            'constructor',
            'public-method',
            'protected-method',
            'private-method',
          ],
        },
      ],
      '@typescript-eslint/no-extraneous-class': [
        'error',
        { allowWithDecorator: true },
      ],

      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'as', objectLiteralTypeAssertions: 'never' },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',

      'linebreak-style': ['error', 'unix'],
      'simple-import-sort/imports': 'error',
      'unicorn/error-message': 'error',
      'unicorn/prefer-ternary': 'warn',
    },
  },

  {
    files: ['apps/iaimc-frontend/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          'tsconfig.base.json',
          'apps/*/tsconfig.json',
          'libs/*/tsconfig.json',
        ],
        tsconfigRootDir: process.cwd(),
      },
    },
    rules: {
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
      '@angular-eslint/use-component-selector': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
          },
        },
      ],
    },
  },

  {
    files: ['**/*.html'],
    rules: {
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/conditional-complexity': [
        'error',
        { maxComplexity: 4 },
      ],
      '@angular-eslint/template/cyclomatic-complexity': [
        'error',
        { maxComplexity: 10 },
      ],
      '@angular-eslint/template/no-call-expression': 'error',
    },
  },

  {
    files: ['**/*.spec.ts', '**/jest.config.ts', '**/test/**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          'tsconfig.base.json',
          'apps/*/tsconfig.json',
          'libs/*/tsconfig.json',
        ],
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

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

  {},

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

  {
    files: ['**/*.ts'],
    rules: {},
  },
];

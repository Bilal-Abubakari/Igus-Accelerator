import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist', '**/node_modules'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
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
      '@angular-eslint/no-inline-styles': 'error',
      'linebreak-style': ['error', 'unix'],

      // NestJS-Specific Rules
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/prefer-readonly': 'error',
      '@typescript-eslint/no-return-await': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/curly': 'error',
      '@typescript-eslint/prefer-const': 'error',
      'linebreak-style': ['error', 'unix'],

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
      '@typescript-eslint/no-public': 'error',
      '@typescript-eslint/parameter-properties': [
        'error',
        {
          prefer: 'readonly',
        },
      ],
      '@typescript-eslint/class-methods-use-this': 'warn',

      //  Import Order & Best Practices
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'prettier/prettier': 'error',

      // Additional Best Practices
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'unicorn/prefer-ternary': 'warn',
      'rxjs/no-ignored-subscription': 'error',
    },
  },
];

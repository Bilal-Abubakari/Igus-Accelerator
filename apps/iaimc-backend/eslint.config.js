const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          allowedNames: [
            'onModuleInit',
            'onModuleDestroy',
            'beforeApplicationShutdown',
            'afterApplicationShutdown',
            'onApplicationBootstrap',
            'onApplicationShutdown',
          ],
        },
      ],

      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public',
            methods: 'explicit',
            properties: 'explicit',
          },
          ignoredMethodNames: [
            'onModuleInit',
            'onModuleDestroy',
            'beforeApplicationShutdown',
            'afterApplicationShutdown',
            'onApplicationBootstrap',
            'onApplicationShutdown',
          ],
        },
      ],
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-inferrable-types': 'error',
    },
  },
];

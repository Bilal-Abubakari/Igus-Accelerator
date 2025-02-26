import nx from '@nx/eslint-plugin';
import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/no-conflicting-lifecycle': 'error',
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      '@angular-eslint/use-injectable-provided-in': 'error',
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-output-native': 'error',
      '@angular-eslint/use-component-selector': 'error',
      '@angular-eslint/no-lifecycle-call': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',
      '@typescript-eslint/explicit-function-return-type': [
        'error',
        {
          allowExpressions: false,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: false,
          allowConciseArrowFunctionExpressionsStartingWithVoid: true,
          allowedNames: [
            'ngOnInit',
            'ngOnDestroy',
            'ngOnChanges',
            'ngAfterViewInit',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewChecked',
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
            'ngOnInit',
            'ngOnDestroy',
            'ngOnChanges',
            'ngAfterViewInit',
            'ngAfterContentInit',
            'ngAfterContentChecked',
            'ngAfterViewChecked',
          ],
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
];

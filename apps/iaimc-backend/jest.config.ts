export default {
  displayName: 'iaimc-backend',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'contact-form\\.dto\\.ts$',
    'contact-form\\.entity\\.ts$',
  ],

  coverageDirectory: '../../coverage/apps/iaimc-backend',
};

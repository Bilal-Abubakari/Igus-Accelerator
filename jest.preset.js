const nxPreset = require('@nx/jest/preset').default;

module.exports = { ...nxPreset };
module.exports = {
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};

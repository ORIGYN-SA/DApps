const path = require('path');

module.exports = {
  moduleNameMapper: {
    '\\.(css|less|scss|sass|svg)$': 'identity-obj-proxy',
    '@testUtils': '<rootDir>/testUtils/index.js',
  },
  moduleDirectories: ['node_modules', 'packages', 'src'],
  testEnvironment: '<rootDir>/testUtils/testEnv.js',
  transformIgnorePatterns: ['node_modules/(?!@dfinity)'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '.+\\.(svg|css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  },
};

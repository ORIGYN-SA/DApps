const { TextEncoder, TextDecoder } = require('util');
const fetch = require('node-fetch');

module.exports = {
  globals: {
    TextEncoder,
    TextDecoder,
    fetch,
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass|svg)$': 'identity-obj-proxy',
    '@testUtils': '<rootDir>/testUtils/index.js',
  },
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/', '/dist/'],
};

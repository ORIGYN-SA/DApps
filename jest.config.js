import { TextDecoder, TextEncoder } from 'util';
import module from 'module';

module.exports = {
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
  },
  moduleNameMapper: {
    '\\.(scss|svg|css)$': '<rootDir>/testUtils/fileMock.js',
    '@testUtils': '<rootDir>/testUtils/index.js',
  },
  moduleDirectories: ['node_modules', 'packages', 'src'],
  testEnvironment: '<rootDir>/testUtils/testEnv.js',
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@connect2ic|@connect2ic/core|@connect2ic/react|@dfinity|event-e3|@astrox)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
};

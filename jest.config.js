module.exports = {
  globals: {
    TextDecoder: TextDecoder,
    TextEncoder: TextEncoder,
  },
  moduleNameMapper: {
    '\\.(scss|svg|css)$': '<rootDir>/src/testUtils/fileMock.js',
    '@testUtils': '<rootDir>/src/testUtils/render.js',
    '@dapp/utils': '<rootDir>/src/packages/utils/src/index.ts',
    '@dapp/common-candid': '<rootDir>/src/packages/common/candid/src/index.ts',
    '@dapp/common-assets': '<rootDir>/src/packages/common/assets/src/index.ts',
    '\\.(svg\\$|svg\\?react)': '<rootDir>/mocks/svg.js',
  },
  moduleDirectories: ['node_modules', 'packages', 'src'],
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!@connect2ic|@connect2ic/core|@connect2ic/react|@dfinity|event-e3|@astrox)',
  ],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
};

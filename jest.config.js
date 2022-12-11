module.exports = {
  moduleNameMapper: {
    '\\.(scss|svg|css)$': '<rootDir>/testUtils/fileMock.js',
    '@testUtils': '<rootDir>/testUtils/index.js',
    '@connect2ic/react': '<rootDir>/node_modules/@connect2ic/react',
    '@connect2ic/core': '<rootDir>/node_modules/@connect2ic/core',
  },

  moduleDirectories: ['node_modules', 'packages', 'src'],
  testEnvironment: '<rootDir>/testUtils/testEnv.js',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      'jest-transform-stub',
  },
};

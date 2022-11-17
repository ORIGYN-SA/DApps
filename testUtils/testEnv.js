const Environment = require('jest-environment-jsdom-global');
module.exports = class CustomTestEnvironment extends Environment {
  constructor({ globalConfig, projectConfig }, context) {
    super({ globalConfig, projectConfig }, context);
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }
    if (typeof this.global.fetch === 'undefined') {
      const fetch = require('node-fetch');
      this.global.fetch = fetch;
    }
  }
};

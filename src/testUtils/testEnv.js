import Environment from 'jest-environment-jsdom-global'
class TestEnvironment extends Environment {
  constructor(config, context) {
    super(config, context);
    if (typeof this.global.TextEncoder === 'undefined') {
      const { TextEncoder } = require('util');
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      const { TextDecoder } = require('util');
      this.global.TextDecoder = TextDecoder;
    }
    if (typeof this.global.fetch === 'undefined') {
      const fetch = require('isomorphic-fetch');
      this.global.fetch = fetch;
    }
  }
};

module.exports = TestEnvironment
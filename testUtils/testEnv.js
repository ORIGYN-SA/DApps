import { TextEncoder, TextDecoder } from 'util';
import fetch from 'isomorphic-fetch';
import Environment from 'jest-environment-jsdom-global';

export default class CustomTestEnvironment extends Environment {
  constructor({ globalConfig, projectConfig }, context) {
    super({ globalConfig, projectConfig }, context);
    if (typeof this.global.TextEncoder === 'undefined') {
      this.global.TextEncoder = TextEncoder;
    }
    if (typeof this.global.TextDecoder === 'undefined') {
      this.global.TextDecoder = TextDecoder;
    }
    if (typeof this.global.fetch === 'undefined') {
      this.global.fetch = fetch;
    }
  }
}

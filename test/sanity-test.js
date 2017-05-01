const config = require('../src/config'); // eslint-disable-line no-unused-vars
import { describe, it } from 'mocha';

import App from '../src/components/App'; // eslint-disable-line no-unused-vars

describe('OneMedia Dashboard Integration', () => {
  describe('Tests > Sanity', () => {
    it('works', () => {
    });
    it('true equals true', () => {
      expect(true).to.be.equal(true);
    });
    it('adds 1 + 2 to equal 3', () => {
      expect(1 + 2).to.be.equal(3);
    });
  });
});

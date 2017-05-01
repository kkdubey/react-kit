const config = require('../config.js');  // eslint-disable-line no-unused-vars

describe('OneMedia Unit Test Cases', () => {
  describe('Tests > Sanity', () => {
    it('works', () => {
      expect(true).to.be.equal(true);
    });

    it('adds 1 + 2 to equal 3', () => {
      expect(1 + 2).to.be.equal(3);
    });
  });
});

// a test script block or suite
describe('Navigate to /', () => {
  before(() => browser.url('/'));

  // a test spec - "specification"
  it('should be load correct page and title', () => browser.getTitle().should.equal('OneMedia'));
});

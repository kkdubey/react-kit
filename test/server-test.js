import { describe, it } from 'mocha';
const request = require('supertest');
import { mockServerBefore, mockServerCleanup } from './serverHelper';

describe('OneMedia Dashboard Integration', () => {
  describe('Tests > Server', () => {
    let apitest;
    before((done) => {
      mockServerBefore(done);
      apitest = request(require('../src/server'));
    });

    it('works', () => {
      expect(true).to.be.equal(true);
      expect('foo').to.have.length(3);
    });

    it('/api/test path does not exists', (done) => {
      apitest.get('/api/test').expect(500, done);
    });

    it('/graphql path returns 400', (done) => {
      apitest.get('/graphql').expect(400, done);
    });

    it('/graphql with news query', (done) => {
      apitest.get('/graphql?query={news{title,link,contentSnippet}}').expect(200, done);
    });

    after((done) => {
      mockServerCleanup(done);
    });
  });
});

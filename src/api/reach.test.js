import { describe, it } from 'mocha';
const request = require('supertest');
import { mockServerBefore, mockServerCleanup } from '../../test/serverHelper';

describe('Reach API', () => {
  let apitest;
  before((done) => {
    mockServerBefore(done);
    apitest = request(require('../server'));
  });

  it('returns status 200 and content type json', (done) => {
    apitest.get('/api/reach')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });

  it('returns status OK, reach is a number >-1', (done) => {
    apitest.get('/api/reach').expect(({ body }) => {
      expect(body).to.include.keys('status', 'reach');
      expect(body.status).to.be.equal('OK');
      expect(parseInt(body.reach, 10)).to.be.a('number');
      expect(body.reach).to.be.greaterThan(-1);
    }).end(done);
  });

  after((done) => {
    mockServerCleanup(done);
  });
});


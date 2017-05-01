import { describe, it } from 'mocha';
const request = require('supertest');
import { mockServerBefore, mockServerCleanup } from '../../test/serverHelper';
import UserCampaign from '../core/models/UserCampaignModel';
import UserModel from '../core/models/UserModel';

describe('Campaign API', () => {
  let apitest;
  before((done) => {
    mockServerBefore(done);
    apitest = request(require('../server'));
  });

  describe('when mongoo is empty', () => {
    it('returns status 200 ok for /api/campaign/list', (done) => {
      apitest.get('/api/campaign/list')
        .expect('Content-Type', /json/)
        .expect(200, done);
    });

    it('returns status 200 ok for /api/campaign/list', (done) => {
      apitest.get('/api/campaign/list').expect(({ body: { status, campaigns } }) => {
        expect(status).to.be.equal('OK');
        expect(campaigns).to.be.instanceof(Array);
        expect(campaigns).to.have.lengthOf(0);
      }).end(done);
    });
  });

  describe('when mongoo has 1 records', () => {
    let userId = '';
    before((done) => {
      UserModel.create({ email: 'U1', name: 'U1',
        password: 'U1', organisation: 'U1', phone: 'U1' },
        (err, user) => {
          userId = user._id;
          UserCampaign.create({
            campaign_name: 'C1',
            created_userid: userId,
            campaign_objective: 'C1',
            campaign_type: 'C1',
            campaign_brand_category: 'C1',
            campaign_running_status: 'Pending',
            campaign_budget: 100,
            startdate: new Date(),
          }, done);
        });
    });

    it('returns array of length 1', (done) => {
      apitest.get(`/api/campaign/list?userid=${userId}`)
        .expect(({ body: { status, campaigns } }) => {
          expect(status).to.be.equal('OK');
          expect(campaigns).to.be.instanceof(Array);
          expect(campaigns).to.have.lengthOf(1);
        }).end(done);
    });

    after((done) => {
      UserCampaign.remove({ created_userid: userId }, () =>
        UserModel.remove({ _id: userId }, done));
    });
  });

  after((done) => {
    mockServerCleanup(done);
  });
});


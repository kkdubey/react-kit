import { describe, it } from 'mocha';
import UserModel from '../core/models/UserModel';
const request = require('supertest');
import { mockServerBefore, mockServerCleanup } from '../../test/serverHelper';


describe('User API', () => {
  let apitest;
  before((done) => {
    mockServerBefore(done);
    apitest = request(require('../server'));
  });

  describe('testing user api', () => {
    it('returns 400 when get on /api/user', (done) => {
      apitest.get('/api/user')
      .expect(400, done);
    });
    it('returns status 400 Bad Request for /api/user/register for incomplete input', (done) => {
      const registerData = {
        email: 'test@test.com',
        organisation: 'OneDigitalAd.com',
      };
      console.log(registerData);
      apitest.post('/api/user/register')
        .send(registerData)
        .expect((res) => {
          console.log(res.body);
        })
        .expect(400, done);
    });
    it('returns status 400 Bad Request for /api/user/register for invalid input', (done) => {
      const registerData = {
        email: 'test@test.com',
        phone: '9999999999',
        name: 'Test Suite',
        organisation: 'OneDigitalAd.com',
      };
      console.log(registerData);
      apitest.post('/api/user/register')
        .send(registerData)
        .expect((res) => {
          console.log(res.body);
        })
        .expect(400, done);
    });
    it('returns status 200 OK for /api/user/register for valid input', (done) => {
      const registerData = {
        email: 'test@test.com',
        phone: '9999999999',
        name: 'Test Suite',
        organisation: 'OneDigitalAd',
      };
      console.log(registerData);
      apitest.post('/api/user/register')
        .send(registerData)
        .expect('Content-Type', /json/)
        .expect((res) => {
          console.log(res.body);
        })
        .expect(200, done);
    });
    it('returns status 200 OK for /api/user/login for valid', (done) => {
      let password = '';
      UserModel.findOne({ email: 'test@test.com' }, (err, user) => {
        password = user.password;
        const loginData = {
          email: 'test@test.com',
          password,
        };
        console.log(loginData);

        apitest.post('/api/user/login')
          .send(loginData)
          .expect('Content-Type', /json/)
          .expect(200, done);
      });
    });
    it('returns status 401 Unauthorised for /api/user/login for wrong password', (done) => {
      const loginData = {
        email: 'test@test.com',
        password: 'Onedigital@123',
      };
      console.log(loginData);
      apitest.post('/api/user/login')
        .send(loginData)
        .expect(401, done);
    });

    // forgot password api

    it('returns status 400 Bad Request for /api/user/forgotpassword for blank input', (done) => {
      const fpData = {};
      apitest.post('/api/user/forgotpassword')
        .send(fpData)
        .expect(400, done);
    });

    it('returns status 400 Bad Request for /api/user/forgotpassword for wrong input', (done) => {
      const fpData = { email: 'onedigitalad' };
      apitest.post('/api/user/forgotpassword')
        .send(fpData)
        .expect(400, done);
    });

    it('returns status 200 OK for /api/user/forgotpassword for valid input', (done) => {
      const fpData = {
        email: 'test@test.com',
      };
      console.log(fpData);
      apitest.post('/api/user/forgotpassword')
          .send(fpData)
          .expect('Content-Type', /json/)
          .expect(200, done);
    });


    after((done) => {
      UserModel.remove({ email: 'test@test.com' }, done);
    });
  });

  after((done) => {
    mockServerCleanup(done);
  });
});

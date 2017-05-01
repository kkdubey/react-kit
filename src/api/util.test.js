import AWS from 'aws-sdk';
import sinon from 'sinon';
import Util from './util';
const util = new Util();
import redis from 'redis';

describe('Util class', () => {
  describe('saveBufferToS3', () => {
    let s3Stub;
    let sandbox;
    let putObjectStub;
    before(() => {
      sandbox = sinon.sandbox.create();
      putObjectStub = sandbox.stub().callsArgWith(1, null, 'done');
      s3Stub = sinon.stub(AWS, 'S3').returns({ putObject: putObjectStub });
    });

    it('calls s3.putObject exactly once', (done) => {
      util.saveBufferToS3('bucketName', 'key', new Buffer('a'), 'contentType', () => {
        expect(s3Stub.calledOnce).to.be.equal(true);
        expect(s3Stub.callCount).to.be.equal(1);
        expect(putObjectStub.calledOnce).to.be.equal(true);
        expect(putObjectStub.callCount).to.be.equal(1);
        done();
      });
    });

    it('calls s3.putObject with correct parameters', (done) => {
      util.saveBufferToS3('bucketName', 'key', new Buffer('a'), 'contentType', () => {
        const [[args]] = putObjectStub.args; // putObjectStub.args[0][0]
        expect(args).to.include.keys('Bucket', 'Key', 'Body', 'StorageClass');
        expect(args).to.have.property('Bucket')
          .that.is.a('string')
          .and.that.equal('bucketName');
        expect(args).to.have.property('Body')
          .that.is.an.instanceof(Buffer);
        expect(args).to.have.property('Key', 'key');
        expect(args).to.have.property('StorageClass', 'REDUCED_REDUNDANCY');
        done();
      });
    });

    after(() => {
      sandbox.restore();
    });
  });

  describe('pfmergeRedis', () => {
    let sandbox;
    let pfmergeStub;
    let pfcountStub;
    let delStub;
    let util1;
    before(() => {
      sandbox = sinon.sandbox.create();
      pfmergeStub = sandbox.stub().callsArgWith(2, null, 'done');
      delStub = sandbox.stub().callsArgWith(1, null, 'done');
      pfcountStub = sandbox.stub().callsArgWith(1, null, 'done');
      sinon.stub(redis, 'createClient').returns({
        pfmerge: pfmergeStub,
        pfcount: pfcountStub,
        del: delStub,
      });
      util1 = new Util();
    });
    describe('array of [\'hll3\', \'hll1\', \'hll2\']', () => {
      it('should call redis pfmerge,pfcount', (done) => {
        util1.pfmergeRedis(['hll3', 'hll1', 'hll2'],
        () => {
          expect(pfmergeStub.calledOnce).to.be.equal(true);
          expect(pfmergeStub.callCount).to.be.equal(1);
          expect(pfcountStub.calledOnce).to.be.equal(true);
          expect(pfcountStub.callCount).to.be.equal(1);
          expect(delStub.calledOnce).to.be.equal(true);
          expect(delStub.callCount).to.be.equal(1);
          expect(pfcountStub.calledAfter(pfmergeStub)).to.be.equal(true);
          expect(pfmergeStub.calledAfter(delStub)).to.be.equal(true);
          done();
        });
      });
    });
    after(() => {
      sandbox.restore();
    });
  });

  describe('getKeysForRange', () => {
    describe('2015-12-25 to 2016-01-05 MYNTRA myntra-16-apr', () => {
      it('should return array of 11 keys matching pattern /.*/MYNTRA/myntra-16-apr/', () => {
        const keyRange = util.getKeysForRange('2015-12-25', '2016-01-05',
         'MYNTRA', 'myntra-16-apr');
        expect(keyRange).is.a('array').and.to.have.lengthOf(11);
        keyRange.map((key) => expect(key).to.match(/\/.*\//));
        keyRange.map((key) => expect(key).to.match(/\/.*\/MYNTRA\/myntra-16-apr\//));
      });
    });

    describe('2015-12-25 to 2016-01-05 Cart User ABOF when device is not passed ', () => {
      it('should return array of 11 keys matching pattern /.*/ABOF/Cart~User/', () => {
        const keyRange = util.getKeysForRange('2015-12-25', '2016-01-05', 'ABOF', 'Cart User');
        expect(keyRange).is.a('array').and.to.have.lengthOf(11);
        keyRange.map((key) => expect(key).to.match(/\/.*\//));
        keyRange.map((key) => expect(key).to.match(/\/.*\/ABOF\/Cart~User\//));
      });
    });

    describe('2015-12-25 to 2016-01-05 ABOF when key and device is not passed ', () => {
      it('should return array of 11 keys matching pattern /.*/ABOF/0/', () => {
        const keyRange = util.getKeysForRange('2015-12-25', '2016-01-05', 'ABOF');
        expect(keyRange).is.a('array').and.to.have.lengthOf(11);
        keyRange.map((key) => expect(key).to.match(/\/.*\//));
        keyRange.map((key) => expect(key).to.match(/\/.*\/ABOF\/0\//));
      });
    });
  });
});

import { AWSConfig, redisUrl, sparkPostapiKey } from '../config';
import AWS from 'aws-sdk';
import moment from 'moment';
import momentrange from 'moment-range';  // eslint-disable-line no-unused-vars
const spaceRegEx = /\s/gi;
import redis from 'redis';
import SparkPost from 'sparkpost';
const sparky = new SparkPost(sparkPostapiKey);

function Util() {
  console.log('redisUrl: ', redisUrl);
  const redisClient = redis.createClient(redisUrl);
  this.getKeysForRange = (fromDate, toDate, customerId, keyName = '0', deviceType = '') => {
    const acc = [];
    const start = moment(fromDate, 'YYYY-MM-DD');
    const end = moment(toDate, 'YYYY-MM-DD');
    const range = moment.range(start, end);

    range.by('d', (m) => acc.push(
      `${m.format('/YYYY/MM/DD')}/${customerId}/${keyName.replace(spaceRegEx, '~')}/${deviceType}`
    ), true);
    return acc;
  };

  this.getKeyFromRedis = (fromDate, toDate, customerId, keyName, callback) => {
    console.log('fromDate: ', fromDate);
    console.log('toDate: ', toDate);
    console.log('customerId: ', customerId);
    console.log('keyName: ', keyName);

    const keys = this.getKeysForRange(fromDate, toDate, customerId, keyName);
    return this.pfmergeRedis(keys, callback);
  };

  this.pfmergeRedis = (keys, callback) => {
    redisClient.del('temp', () => {
      redisClient.pfmerge('temp', keys, () => redisClient.pfcount('temp', callback));
    });
  };

  this.saveBufferToS3 = (bucketName, key, buffer, contentType, callback) => {
    AWS.config.update({
      accessKeyId: AWSConfig.credentials.accessKey,
      secretAccessKey: AWSConfig.credentials.secretKey,
      region: AWSConfig.region,
    });

    const s3 = new AWS.S3();

    s3.putObject({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: contentType,
      StorageClass: 'REDUCED_REDUNDANCY',
    }, (err, data) => {
      if (err) {
        console.warn(err);
      }

      if (callback) {
        callback(err, {
          data,
          key: `${AWSConfig.cdnUrl}/${key}`,
        });
      }
    });
  };

  this.sendMailUtil = (frommail, tomail, message, subject) => {
    sparky.transmissions.send({
      transmissionBody: {
        content: {
          from: frommail,
          subject,
          html: message,
        },
        recipients: [
          { address: tomail },
        ],
      },
    }, (err, res) => {
      const data = { isSuccess: false, error: {}, res: {} };
      if (err) {
        console.log(err);
        data.isSuccess = false;
        data.error = err;
        data.res = res;
      } else {
        data.isSuccess = true;
        console.log(`mail sent successfuly to ${tomail}`);
      }

      return data;
    });
  };
}

export default Util;

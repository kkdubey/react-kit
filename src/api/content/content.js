import { Router } from 'express';
const router = new Router();
import Busboy from 'busboy';
import { AWSConfig } from '../../config';
import Util from '../util';
import gm from 'gm';
import fs from 'file-system';
import generatePassword from 'password-generator';
import path from 'path';
import nodeExcel from 'excel-export';
import UserCampaign from '../../core/models/UserCampaignModel';
import Creative from '../../core/models/CreativeModel';
import mongoose from 'mongoose';
import CampaignDAO from '../../core/dao/campaign/CampaignDAO';
import CampaignRealTimeDAO from '../../core/dao/campaign/CampaignRealTimeDAO';
import moment from 'moment';

router.post('/validateBudget', async(req, res, next) => {
  try {
    const busboy = new Busboy({ headers: req.headers });
    let dataCapture = new Buffer(0);
    let excelFileName = '';
    let contentType = '';

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      contentType = mimetype;
      excelFileName = filename;
      file.on('data', (data) => {
        dataCapture = Buffer.concat([dataCapture, data]);
      });
      file.on('end', () => {
      });
    });
    busboy.on('finish', () => {
      const util = new Util();
      let prepareKey = '';
      const storeFileName = `${AWSConfig.campaign_dir}/${excelFileName}`;
      fs.writeFile(storeFileName, dataCapture, (err) => {
        console.warn('Storing the file. ', storeFileName);
        if (err) {
          console.warn('Error while storing the file', err);
          return res.status(500).send('Error while storing file');
        }

        fs.readFile(storeFileName, (fileError, data) => {
          if (!fileError) {
            const random = generatePassword(12, false);
            const today = new Date();
            const fileExtension = path.extname(storeFileName);
            const month = (today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`; // eslint-disable-line

            prepareKey = `file/${today.getFullYear()}/${month}/${today.getDate()}/${random}${fileExtension}`; // eslint-disable-line
            console.warn('prepare key: ', prepareKey);
            util.saveBufferToS3(AWSConfig.campaign_bucket, prepareKey, data,
              contentType, (saveErr, dataS3) => {
                if (!saveErr) {
                  return res.json(dataS3);
                }

                return res.status(500).send('Error while getting storage data from s3');
              });
          } else {
            console.warn(fileError);
            return res.status(500).send('File Error:  Please upload and Try Again');
          }

          return false;
        });
        return false;
      });
    });
    req.pipe(busboy);
    return true;
  } catch (err) {
    next(err);
    return false;
  }
});

router.post('/creative', async(req, res, next) => {
  try {
    const busboy = new Busboy({ headers: req.headers });
    let dataCapture = new Buffer(0);
    let creativeFilename = '';
    let contentType = '';

    busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
      contentType = mimetype;
      creativeFilename = filename;
      file.on('data', (data) => {
        dataCapture = Buffer.concat([dataCapture, data]);
      });
      file.on('end', () => {
      });
    });
    busboy.on('finish', () => {
      const util = new Util();
      let prepareKey = '';
      const storeFileName = `${AWSConfig.campaign_dir}/${creativeFilename}`;
      fs.writeFile(storeFileName, dataCapture, (err) => {
        console.warn('Storing the file. ', storeFileName);
        if (err) {
          console.warn('Error while storing the file', err);
          return res.status(500).send('Error while storing file');
        }

        const imageMagic = gm.subClass({ imageMagick: true });
        imageMagic(storeFileName).size((imageErr, size) => {
          if (!imageErr) {
            const random = generatePassword(12, false);

            // creatives/year/month/day
            const today = new Date();
            const fileExtension = path.extname(storeFileName);
            const month = (today.getMonth() + 1) < 10 ? `0${today.getMonth() + 1}` : `${today.getMonth() + 1}`; // eslint-disable-line

            prepareKey = `creatives/${today.getFullYear()}/${month}/${today.getDate()}/${size.width}x${size.height}/${random}${fileExtension}`; // eslint-disable-line
            console.warn('prepare key: ', prepareKey);
            util.saveBufferToS3(AWSConfig.campaign_bucket, prepareKey, dataCapture,
              contentType, (saveErr, data) => {
                if (!saveErr) {
                  const creativeInstance = new Creative(
                    {
                      identifier: random, imageHeight: size.height,
                      imageWidth: size.width, cdnUrl: data.key,
                    }
                  );
                  creativeInstance.save((creativeErr) => {
                    if (!creativeErr) {
                      const returnData = {};
                      returnData.cdnUrl = data.key;
                      returnData.identifier = creativeInstance.identifier;
                      returnData.imageWidth = creativeInstance.imageWidth;
                      returnData.imageHeight = creativeInstance.imageHeight;
                      returnData._id = creativeInstance._id;
                      return res.status(200).send(returnData);
                    }

                    return res.status(500).send('Error while getting storage data from s3');
                  });
                } else {
                  return res.status(500).send('Error while getting storage data from s3');
                }

                return false;
              });
          } else {
            console.warn(imageErr);
            return res.status(500).send('Image file type is wrong. Please upload and Try Again');
          }

          return false;
        });
        return false;
      });
    });
    req.pipe(busboy);
    return true;
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/:campaignid/download', async(req, res, next) => { // eslint-disable-line
  const start = req.query.startdate;

  const end = req.query.enddate;
  if (!start || !end) {
    return res.status(400).send('Error: Please provide startdate and enddate params');
  }

  try {
    const confCampaign = {};
    confCampaign.name = 'CampaignData';
    const confToday = {};
    confToday.name = 'TodaysData';
    confCampaign.cols = [
      { caption: 'Sr No', type: 'number', width: 15 },
      { caption: 'Date', type: 'string', width: 15 },
      { caption: 'Impressions', type: 'number', width: 15 },
      { caption: 'Clicks', type: 'number', width: 15 },
      { caption: 'Spend', type: 'number', width: 15 },
      { caption: 'CTR', type: 'number', width: 15 },
      { caption: 'CPC', type: 'number', width: 15 },
    ];
    confToday.cols = [
      { caption: 'Sr No', type: 'number', width: 15 },
      { caption: 'Date', type: 'string', width: 15 },
      { caption: 'Impressions', type: 'number', width: 15 },
      { caption: 'Clicks', type: 'number', width: 15 },
      { caption: 'CTR', type: 'number', width: 15 },
      { caption: 'CPC', type: 'number', width: 15 },
      { caption: 'View Thru', type: 'number', width: 15 },
      { caption: 'Click Thru', type: 'number', width: 15 },
    ];

    const campaignDAO = new CampaignDAO();
    const campaignRTDAO = new CampaignRealTimeDAO();

    const campaignId = new mongoose.Types.ObjectId(req.params.campaignid);
    console.warn('Campaign Id : ', campaignId);
    UserCampaign.findOne({ _id: campaignId },
      'campaign_name advertiser campaign_type', (err, doc) => {
        if (!err) {
          if (doc) {
            console.log(doc);
            const campaignName = doc.campaign_name;
            const advertiser = doc.advertiser;
            const campaignType = doc.campaign_type;

            campaignDAO.getCampaignDataForDateRange(start, end, campaignName, advertiser, (graphErr, graphData) => { // eslint-disable-line
              if (graphErr) {
                return res.status(500)
                  .send({ message: 'Not able to return results for graph data' });
              }

              console.log('graphData: ', graphData);
              campaignRTDAO.getTodaysStatsForCampaign(advertiser, campaignName, (statsErr, statsData) => { // eslint-disable-line
                if (statsErr) {
                  return res.status(500)
                    .send({ message: 'Not able to return results for todays stats' });
                }

                console.log('statsData: ', statsData);
                campaignRTDAO.getTransactionStatsTodayForCampaign(advertiser, campaignType,
                  (txErr, txData) => {
                    if (txErr) {
                      return res.status(500)
                        .send({ message: 'Not able to return transactions todays stats' });
                    }

                    const confCampaignTempArray = [];
                    const confTodayTempArray = [];

                    for (let k = 0; k < graphData.impressions.data.length; k++) {
                      const impressionData = graphData.impressions.data[k];
                      const clicksData = graphData.clicks.data[k];
                      const ctrData = graphData.ctr.data[k];
                      const cpcData = graphData.cpc.data[k];
                      const spendData = graphData.spend.data[k];

                      const tempArray = [k + 1, moment(impressionData.date).format('YYYY-MM-DD'),
                        impressionData.value, clicksData.value, spendData.value,
                        ctrData.value, cpcData.value];
                      console.log(tempArray);
                      confCampaignTempArray.push(tempArray);
                    }

                    const yesterdayDate = moment(statsData.date).subtract(1, 'days')
                      .format('YYYY-MM-DD');

                    confTodayTempArray.push([1, yesterdayDate, statsData.impressions.yesterday,
                      statsData.clicks.yesterday, statsData.ctr.yesterday, statsData.cpc.yesterday,
                      txData.vtxn.yesterday, txData.ctxn.yesterday]);

                    confTodayTempArray.push([2, statsData.date, statsData.impressions.value,
                      statsData.clicks.value, statsData.ctr.value, statsData.cpc.value,
                      txData.vtxn.value, txData.ctxn.value]);

                    confCampaign.rows = confCampaignTempArray;

                    console.log(confCampaignTempArray);
                    confToday.rows = confTodayTempArray;

                    const result = nodeExcel.execute([confCampaign, confToday]);
                    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                    res.setHeader('Content-Disposition',
                      'attachment; filename=CampaignReport.xlsx');
                    return res.end(result, 'binary');
                  });
              });
            });
          }
        }
      });
  } catch (err) {
    next(err);
    return false;
  }
});

export default router;


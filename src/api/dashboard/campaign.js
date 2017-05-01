/* eslint-disable consistent-return */

import { Router } from 'express';
import UserCampaign from '../../core/models/UserCampaignModel';

import mongoose from 'mongoose';
import CampaignDAO from '../../core/dao/campaign/CampaignDAO';
import CampaignRealTimeDAO from '../../core/dao/campaign/CampaignRealTimeDAO';

const router = new Router();

router.get('/:campaignid/dummystats', async(req, res, next) => {
  try {
    const start = new Date(Date.parse(req.query.startdate));
    const end = new Date(Date.parse(req.query.enddate));
    const campaignId = req.params.campaignid;
    /* eslint-disable no-console */
    console.log('Start: ', start);
    console.log('End: ', end);
    console.log('Campaign: ', campaignId);

    const results = {};

    // top metrics data
    const metricData = {};
    metricData.spend = Math.floor(Math.random() * (3000 - 1000 + 1) + 1000);
    metricData.uniquereach = Math.floor(Math.random() * (20000 - 12000 + 1) + 12000);
    metricData.impressions = Math.floor(Math.random() * (150000 - 30000 + 1) + 150000);
    metricData.clicks = Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
    metricData.ctr = Math.random().toFixed(2) * (1);
    metricData.cpc = Math.floor(Math.random() * (200 - 10 + 1) + 10);
    metricData.ecpm = Math.floor(Math.random() * (200 - 10 + 1) + 10);
    metricData.ctt = Math.floor(Math.random() * (200 - 100 + 1) + 100);
    metricData.vtt = Math.floor(Math.random() * (200 - 100 + 1) + 100);
    results.metrics = metricData;

    // today's data
    const todayMetric = {};

    todayMetric.date = new Date();
    todayMetric.impressions = {};
    todayMetric.impressions.value = Math.floor(Math.random() * (150000 - 30000 + 1) + 150000);
    todayMetric.impressions.yesterday = todayMetric.impressions.value + 10000;
    todayMetric.impressions.yesterdaytotal = todayMetric.impressions.value + 30000;
    todayMetric.impressions.change = Math.random().toFixed(2) * (100);

    todayMetric.clicks = {};
    todayMetric.clicks.value = Math.floor(Math.random() * (2000 - 1000 + 1) + 1000);
    todayMetric.clicks.yesterday = todayMetric.clicks.value + 40;
    todayMetric.clicks.yesterdaytotal = todayMetric.clicks.value + 100;
    todayMetric.clicks.change = Math.random().toFixed(2) * (-100);

    todayMetric.ctr = {};
    todayMetric.ctr.value = Math.random().toFixed(2);
    todayMetric.ctr.yesterday = todayMetric.ctr.value + 0.05;
    todayMetric.ctr.yesterdaytotal = todayMetric.ctr.value + 0.25;
    todayMetric.ctr.change = Math.random().toFixed(2) * (100);

    todayMetric.cpc = {};
    todayMetric.cpc.value = Math.floor(Math.random() * (200 - 10 + 1) + 10);
    todayMetric.cpc.yesterday = todayMetric.cpc.value + 10;
    todayMetric.cpc.yesterdaytotal = todayMetric.cpc.value + 50;
    todayMetric.cpc.change = Math.random().toFixed(2) * (100);

    todayMetric.spend = {};
    todayMetric.spend.value = Math.floor(Math.random() * (20000 - 30000 + 1) + 150000);
    todayMetric.spend.yesterday = todayMetric.impressions.value + 10000;
    todayMetric.spend.yesterdaytotal = todayMetric.impressions.value + 30000;
    todayMetric.spend.change = Math.random().toFixed(2) * (100);

    todayMetric.ctxn = {};
    todayMetric.ctxn.value = Math.floor(Math.random() * (150000 - 30000 + 1) + 150000);
    todayMetric.ctxn.yesterday = todayMetric.ctxn.value + 10000;
    todayMetric.ctxn.yesterdaytotal = todayMetric.ctxn.value + 30000;
    todayMetric.ctxn.change = Math.random().toFixed(2) * (100);

    todayMetric.vtxn = {};
    todayMetric.vtxn.value = Math.floor(Math.random() * (100 - 30 + 1) + 100);
    todayMetric.vtxn.yesterday = todayMetric.vtxn.value + 10;
    todayMetric.vtxn.yesterdaytotal = todayMetric.vtxn.value + 30;
    todayMetric.vtxn.change = Math.random().toFixed(2) * (100);

    results.today = todayMetric;

    const shortWeekDaysNameArray = new Array(7);
    shortWeekDaysNameArray[0] = 'Sun';
    shortWeekDaysNameArray[1] = 'Mon';
    shortWeekDaysNameArray[2] = 'Tue';
    shortWeekDaysNameArray[3] = 'Wed';
    shortWeekDaysNameArray[4] = 'Thu';
    shortWeekDaysNameArray[5] = 'Fri';
    shortWeekDaysNameArray[6] = 'Sat';

    const impressionArray = [];
    const clickArray = [];
    const cpcArray = [];
    const ctrArray = [];

    for (let dateCounter = start; dateCounter <= end;) {
      const newDate = new Date(dateCounter);
      const dotw = shortWeekDaysNameArray[dateCounter.getDay()];
      const month = (newDate.getMonth() + 1) < 10 ? `0${newDate.getMonth() + 1}` : `${newDate.getMonth() + 1}`; // eslint-disable-line
      const day = (newDate.getDate()) < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`;
      const label = `${day}/${month}`;

      const impression = {};
      impression.value = Math.floor(Math.random() * (15000 - 3000 + 1) + 15000);
      impression.date = newDate;
      impression.dotw = dotw;
      impression.label = label;
      impressionArray.push(impression);

      const click = {};
      click.value = Math.floor(Math.random() * (1000 - 500 + 1) + 500);
      click.date = newDate;
      click.dotw = dotw;
      click.label = label;
      clickArray.push(click);

      const ctr = {};
      ctr.value = (Math.random().toFixed(2)) * 100;
      ctr.date = newDate;
      ctr.dotw = dotw;
      ctr.label = label;
      ctrArray.push(ctr);

      const cpc = {};
      cpc.value = (Math.random().toFixed(2)) * 100;
      cpc.date = newDate;
      cpc.dotw = dotw;
      cpc.label = label;
      cpcArray.push(cpc);

      dateCounter.setDate(dateCounter.getDate() + 1);
    }

    results.data = {};
    results.data.impressions = {};
    results.data.impressions.data = impressionArray;
    results.data.impressions.label = 'Impressions';
    results.data.order = 1;

    results.data.clicks = {};
    results.data.clicks.data = clickArray;
    results.data.clicks.label = 'Clicks';
    results.data.order = 2;

    results.data.ctr = {};
    results.data.ctr.data = ctrArray;
    results.data.ctr.label = 'CTR';
    results.data.order = 3;

    results.data.cpc = {};
    results.data.cpc.data = cpcArray;
    results.data.cpc.label = 'CPC';
    results.data.order = 4;

    return res.json({
      status: 'OK',
      results,
    });
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/:campaignid/stats', async(req, res, next) => {
  // const start = new Date(Date.parse(req.query.startdate));
  const start = req.query.startdate;

  // const end = new Date(Date.parse(req.query.enddate));
  const end = req.query.enddate;
  try {
    const campaignDAO = new CampaignDAO();
    const campaignRTDAO = new CampaignRealTimeDAO();

    const campaignId = new mongoose.Types.ObjectId(req.params.campaignid);
    console.warn('Campaign Id : ', campaignId);
    UserCampaign.findOne({ _id: campaignId },
      'campaign_name advertiser campaign_identifier campaign_type', (err, doc) => {
        if (!err) {
          if (doc) {
            console.log(doc);
            const campaignName = doc.campaign_name;
            const campaignCustomerId = doc.campaign_identifier;
            const advertiser = doc.advertiser;
            const campaignType = doc.campaign_type;
            const returnData = {};
            campaignDAO.getCampaignPerformanceForDateRange(start, end, campaignName, campaignCustomerId, advertiser, (err, data) => { // eslint-disable-line
              if (err) {
                return res.status(500)
                  .send({ message: 'Not able to return results' });
              }

              returnData.metrics = data;
              campaignDAO.getCampaignDataForDateRange(start, end, campaignName, advertiser, (graphErr, graphData) => { // eslint-disable-line
                if (graphErr) {
                  return res.status(500)
                    .send({ message: 'Not able to return results' });
                }

                returnData.data = graphData;
                campaignDAO.getViewAndClickThruTransactionData(start, end, advertiser, (vttErr, vttData) => { // eslint-disable-line
                  if (vttErr) {
                    return res.status(500).send({ message: 'Not able to get ctt vtt data' });
                  }

                  returnData.metrics.vtt = vttData.vtt;
                  returnData.metrics.ctt = vttData.ctt;
                  console.log(returnData.metrics);
                  campaignRTDAO.getTodaysStatsForCampaign(advertiser, campaignName, (statsErr, statsData) => { // eslint-disable-line
                    if (statsErr) {
                      return res.status(500)
                        .send({ message: 'Not able to return results' });
                    }

                    returnData.today = statsData;
                    campaignRTDAO.getTransactionStatsTodayForCampaign(advertiser, campaignType,
                      (txErr, txData) => {
                        if (txErr) {
                          return res.status(500)
                            .send({ message: 'Not able to return results' });
                        }

                        returnData.today.vtxn = txData.vtxn;
                        returnData.today.ctxn = txData.ctxn;
                        return res.json({
                          status: 'OK',
                          results: returnData,
                        });
                      });
                  });
                });
              });
            });
          } else {
            return res.status(500)
              .send({ message: `Not able to find campaign with id: ${campaignId}` });
          }
        } else {
          return res.status(500)
            .send({ message: `Not able to find campaign with id: ${campaignId}` });
        }
      });
  } catch (err) {
    next(err);
    return false;
  }
});

export default router;


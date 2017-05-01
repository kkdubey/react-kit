import { campaignStatsQuery, campaignDataQuery,
  campaignPerformanceQuery, campaignCVTTQuery } from '../../../config';
import postgres from '../../../core/db';

import CampaignRealTimeDAO from './CampaignRealTimeDAO';

function CampaignDAO() {
  this.getViewAndClickThruTransactionData = (startDate, endDate, advertiser, callback) => {
    postgres.connect(async(client, err) => {
      if (err) {
        console.warn('Could not connect to postgres sql server');
        console.warn(err);
        callback(err, null);
      }

      console.log('campaignCVTTQuery: ', campaignCVTTQuery);
      client.query(campaignCVTTQuery, startDate, endDate, advertiser)
        .then((results) => {
          let returnData = {};
          if (results.rows.length > 0) {
            returnData = results.rows[0];
          } else {
            returnData.vtt = 0;
            returnData.ctt = 0;
          }

          console.log('VTT - CTT data: ', returnData);
          callback(null, returnData);
        }, (reason) => {
          console.warn('Could not execute cvtt query');
          console.warn(reason);
          callback(reason, null);
        });
    });
  };

  this.getCampaignPerformanceForDateRange = (startDate, endDate, campaignName, customerId, advertiserName, callback) => { // eslint-disable-line
    console.log('Campaign cards/stats data : campaign name: ', campaignName);
    console.log('advertiserName ', advertiserName);
    console.log('start date', startDate);
    console.log('end date', endDate);
    console.log('Connecting with database');

    postgres.connect(async(client, err) => {
      if (err) {
        console.warn('Could not connect to postgres sql server');
        console.warn(err);
        callback(err, null);
      }

      console.log('campaignStatsQuery: ', campaignStatsQuery);
      client.query(campaignStatsQuery, startDate, endDate, campaignName, advertiserName)
        .then((results) => {
          let returnData = {};
          if (results.rows.length > 0) {
            returnData = results.rows[0];
            returnData.spend = (returnData.spend / 1000000);
            console.log(returnData);
            returnData.ctr = ((returnData.clicks / returnData.impressions) * 100);
            returnData.cpc = (returnData.spend / returnData.clicks);
            returnData.ecpm = (returnData.spend / returnData.impressions) * 1000;
          } else {
            returnData.impressions = 0;
            returnData.clicks = 0;
            returnData.spend = 0;
            returnData.ctr = 0;
            returnData.cpc = 0;
            returnData.ecpm = 0;
            returnData.uniquereach = 0;
          }

          const campaignRTDAO = new CampaignRealTimeDAO();
          campaignRTDAO.getUniqueReachFromRedis(startDate, endDate, customerId, campaignName,
            (uErr, uniqueResult) => {
              if (uErr) {
                returnData.uniquereach = 0;
              }

              returnData.uniquereach = uniqueResult;
            });
          callback(null, returnData);
        }, (reason) => {
          console.warn('Could not execute');
          console.warn(reason);
          callback(reason, null);
        });
    });
  };

  this.getCampaignDataForDateRange = (startDate, endDate, campaignName, advertiserName, callback) => { // eslint-disable-line
    console.log('campaign name: ', campaignName);
    console.log('advertiserName ', advertiserName);
    console.log('start date', startDate);
    console.log('end date', endDate);
    console.log('Connecting with database');
    const weekDay = new Array(7);
    weekDay[0] = 'Sun';
    weekDay[1] = 'Mon';
    weekDay[2] = 'Tue';
    weekDay[3] = 'Wed';
    weekDay[4] = 'Thu';
    weekDay[5] = 'Fri';
    weekDay[6] = 'Sat';

    postgres.connect(async(client, err) => {
      if (err) {
        console.warn('Could not connect to postgres sql server');
        console.warn(err);
        callback(err, null);
      }

      console.log('campaignDataQuery: ', campaignDataQuery);
      client.query(campaignDataQuery, startDate, endDate, campaignName, advertiserName)
        .then((results) => {
          const returnData = {};
          returnData.impressions = {};
          returnData.impressions.data = [];
          returnData.impressions.label = 'Impressions';

          returnData.clicks = {};
          returnData.clicks.data = [];
          returnData.clicks.label = 'Clicks';

          returnData.ctr = {};
          returnData.ctr.data = [];
          returnData.ctr.label = 'CTR';

          returnData.cpc = {};
          returnData.cpc.data = [];
          returnData.cpc.label = 'CPC';

          returnData.spend = {};
          returnData.spend.data = [];
          returnData.spend.label = 'Spend';

          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const impressionData = {};
              const clickData = {};
              const ctrData = {};
              const cpcData = {};
              const spendData = {};
              const dateLog = new Date(results.rows[i].time_sql_date);
              const dotw = weekDay[dateLog.getDay()];
              const month = (dateLog.getMonth() + 1) < 10 ?
                `0${dateLog.getMonth() + 1}` : `${dateLog.getMonth() + 1}`;
              const day = dateLog.getDate();

              if (i === 0) {
                returnData.impressions.start = results.rows[i].time_sql_date;
                returnData.clicks.start = results.rows[i].time_sql_date;
                returnData.cpc.start = results.rows[i].time_sql_date;
                returnData.ctr.start = results.rows[i].time_sql_date;
              }

              if (i === results.rows.length - 1) {
                returnData.impressions.end = results.rows[i].time_sql_date;
                returnData.clicks.end = results.rows[i].time_sql_date;
                returnData.cpc.end = results.rows[i].time_sql_date;
                returnData.ctr.end = results.rows[i].time_sql_date;
              }

              impressionData.value = results.rows[i].impressions;
              impressionData.date = results.rows[i].time_sql_date;
              impressionData.dotw = dotw;
              impressionData.label = `${day}/${month}`;

              clickData.value = results.rows[i].clicks;
              clickData.date = results.rows[i].time_sql_date;
              clickData.dotw = dotw;
              clickData.label = `${day}/${month}`;

              spendData.value = results.rows[i].spend / 1000000;
              spendData.date = results.rows[i].time_sql_date;
              spendData.dotw = dotw;
              spendData.label = `${day}/${month}`;
              if (results.rows[i].clicks) {
                if (results.rows[i].clicks !== 0) {
                  const cpcValue = (spendData.value / results.rows[i].clicks);
                  if (cpcValue) {
                    cpcData.value = cpcValue.toFixed(2);
                  } else {
                    cpcData.value = 0.0;
                  }
                } else {
                  cpcData.value = 0.0;
                }
              } else {
                cpcData.value = 0.0;
              }

              cpcData.date = results.rows[i].time_sql_date;
              cpcData.dotw = dotw;
              cpcData.label = `${day}/${month}`;

              if (results.rows[i].impressions !== 0) {
                if (results.rows[i].impressions !== 0) {
                  const ctrValue = (results.rows[i].clicks / results.rows[i].impressions) * 100;
                  if (ctrValue) {
                    ctrData.value = ctrValue.toFixed(2);
                  } else {
                    ctrData.value = 0.0;
                  }
                } else {
                  ctrData.value = 0.0;
                }
              } else {
                ctrData.value = 0.0;
              }

              ctrData.date = results.rows[i].time_sql_date;
              ctrData.dotw = dotw;
              ctrData.label = `${day}/${month}`;

              returnData.impressions.data[i] = impressionData;
              returnData.clicks.data[i] = clickData;
              returnData.ctr.data[i] = ctrData;
              returnData.cpc.data[i] = cpcData;
              returnData.spend.data[i] = spendData;
            }
          }

          callback(null, returnData);
        }, (reason) => {
          console.warn('Could not execute');
          console.warn(reason);
          callback(reason, null);
        });
    });
  };

  this.getCampaignPerformance = (advertiserName, callback) => {
    console.log('advertiserName ', advertiserName);

    postgres.connect(async(client, err) => {
      if (err) {
        console.warn('Could not connect to postgres sql server');
        console.warn(err);
        callback(err, null);
      }

      console.log('campaignPerformanceQuery: ', campaignPerformanceQuery);
      client.query(campaignPerformanceQuery, advertiserName)
        .then((results) => {
          let returnDataMap = {};
          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const returnData = results.rows[i];
              if (returnData.spend) {
                returnData.spend = returnData.spend / 1000000;
              }

              console.log(returnData);

              if (returnData.clicks) {
                const clickInt = parseInt(returnData.clicks, 10);
                if (clickInt === 0) {
                  returnData.cpc = 0;
                } else {
                  returnData.cpc = (returnData.spend / clickInt);
                }
              } else {
                returnData.clicks = 0;
                returnData.cpc = 0;
              }

              if (returnData.impressions) {
                const impressionInt = parseInt(returnData.impressions, 10);
                if (impressionInt === 0) {
                  returnData.ctr = 0;
                } else {
                  returnData.ctr = ((returnData.clicks / impressionInt) * 100);
                }
              }

              returnDataMap[returnData.campaign_name] = returnData;
            }
          } else {
            returnDataMap = {};
          }

          callback(null, returnDataMap);
        }, (reason) => {
          console.warn('Could not execute');
          console.warn(reason);
          callback(reason, null);
        });
    });
  };
}

export default CampaignDAO;

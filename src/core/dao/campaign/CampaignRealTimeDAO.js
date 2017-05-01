import { campaignRealTimeDBQuery, campaignAppTransactionDBQuery,
  campaignSiteTransactionDBQuery, campaignAppTransactionTotalDBQuery,
  campaignSiteTransactionTotalDBQuery,
  campaignRealTimeDBTotalQuery, onemediaTimeZone } from '../../../config';
import CassandraClient from '../../dao/CassandraClient';
import Util from '../../../api/util';
import moment from 'moment-timezone';

function CampaignRealTimeDAO() {
  this.getTransactionStatsTodayForCampaign = (advertiser, campaignType, callback) => {
    const cassandraClient = new CassandraClient();
    const today = moment().tz(onemediaTimeZone).format('YYYY-MM-DD');
    const yesterday = moment().tz(onemediaTimeZone).subtract(1, 'days')
      .format('YYYY-MM-DD');

    const timeHour = moment().tz(onemediaTimeZone).get('hour');
    console.log('today', today);
    console.log('yesterday', yesterday);
    console.log('onemediaTimeZone', onemediaTimeZone);
    console.log('timeHour', timeHour);

    let todaysData = {};
    let yesterdayData = {};

    const returnData = {};
    returnData.date = today;

    let query = campaignSiteTransactionDBQuery;
    let totalQuery = campaignSiteTransactionTotalDBQuery;

    if (campaignType === 'MobileApp') {
      query = campaignAppTransactionDBQuery;
      totalQuery = campaignAppTransactionTotalDBQuery;
    }

    console.log('Real Time DB: Transaction Query: ', query);
    cassandraClient.queryRealTimeDB(query, [today, timeHour,
      advertiser], (tErr, tResults) => { // eslint-disable-line
        if (tErr) {
          console.warn(tErr);
          return callback(tErr, null);
        }

        if (tResults.rows.length > 0) {
          todaysData = tResults.rows[0];
        }

        cassandraClient.queryRealTimeDB(query, [yesterday, timeHour,
          advertiser], (yErr, yResults) => { // eslint-disable-line
            if (yErr) {
              console.warn(yErr);
              return callback(yErr, null);
            }

            if (yResults.rows.length > 0) {
              yesterdayData = yResults.rows[0];
            }

            cassandraClient.queryRealTimeDB(totalQuery, [yesterday, advertiser],
              (ytErr, ytResults) => {
                console.log(ytErr);
                if (ytErr) {
                  return callback(ytErr, null);
                }

                let yesterdayTotalData = {};
                if (ytResults.rows.length > 0) {
                  yesterdayTotalData = ytResults.rows[0];
                }

                returnData.vtxn = {};
                returnData.vtxn.value = todaysData.vtxn ? todaysData.vtxn.valueOf() : 0;
                returnData.vtxn.yesterday = yesterdayData.vtxn ?
                yesterdayData.vtxn.valueOf() : 0;
                returnData.vtxn.yesterdaytotal = yesterdayTotalData.vtxn ?
                yesterdayTotalData.vtxn.valueOf() : 0;
                if (yesterdayData.vtxn) {
                  if (yesterdayData.vtxn !== 0) {
                    returnData.vtxn.change = (returnData.vtxn.value !== 0) ?
                    ((returnData.vtxn.value - returnData.vtxn.yesterday)
                    * 100) / yesterdayData.vtxn : 0;
                  } else {
                    returnData.vtxn.change = 0;
                  }
                } else {
                  returnData.vtxn.change = 0;
                }

                returnData.ctxn = {};
                returnData.ctxn.value = todaysData.ctxn ? todaysData.ctxn.valueOf() : 0;
                returnData.ctxn.yesterday = yesterdayData.ctxn ?
                yesterdayData.ctxn.valueOf() : 0;
                returnData.ctxn.yesterdaytotal = yesterdayTotalData.ctxn ?
                yesterdayTotalData.ctxn.valueOf() : 0;
                if (yesterdayData.ctxn) {
                  if (yesterdayData.ctxn !== 0) {
                    returnData.ctxn.change = (returnData.ctxn.value !== 0) ?
                    ((returnData.ctxn.value - returnData.ctxn.yesterday)
                    * 100) / yesterdayData.ctxn : 0;
                  } else {
                    returnData.ctxn.change = 0;
                  }
                } else {
                  returnData.ctxn.change = 0;
                }

                console.log('Transaction data :', returnData);
                return callback(null, returnData);
              });
          });
      });
  };

  this.getTodaysStatsForCampaign = (advertiser, campaignName, callback) => {
    const cassandraClient = new CassandraClient();
    const today = moment().tz(onemediaTimeZone).format('YYYY-MM-DD');
    const yesterday = moment().tz(onemediaTimeZone).subtract(1, 'days')
      .format('YYYY-MM-DD');

    const timeHour = moment().tz(onemediaTimeZone).get('hour');
    console.log('today', today);
    console.log('yesterday', yesterday);
    console.log('onemediaTimeZone', onemediaTimeZone);
    console.log('timeHour', timeHour);
    let todaysData = {};
    let yesterdayData = {};

    const returnData = {};
    returnData.date = today;

    cassandraClient.queryRealTimeDB(campaignRealTimeDBQuery, [today, timeHour, campaignName,
      advertiser], (tErr, tResults) => { // eslint-disable-line
        /* eslint-disable no-console */
        if (tErr) {
          console.warn(tErr);
          return callback(tErr, null);
        }

        if (tResults.rows.length > 0) {
          todaysData = tResults.rows[0];
        }

        cassandraClient.queryRealTimeDB(campaignRealTimeDBQuery, [yesterday, timeHour, campaignName,
          advertiser], (yErr, yResults) => { // eslint-disable-line
            if (yErr) {
              console.warn(yErr);
              return callback(yErr, null);
            }

            if (yResults.rows.length > 0) {
              yesterdayData = yResults.rows[0];
            }

            cassandraClient.queryRealTimeDB(campaignRealTimeDBTotalQuery, [yesterday, campaignName,
              advertiser], (yTErr, yTResults) => { // eslint-disable-line
                let yesterdayTotalData = {};
                console.log(yTErr);
                if (yTErr) {
                  return callback(yTErr, null);
                }

                if (yTResults.rows.length > 0) {
                  yesterdayTotalData = yTResults.rows[0];
                }

                console.log(todaysData);
                console.log(yesterdayData);

                console.log('todaysData.impression', todaysData.impression);
                console.log('todaysData.impression.valueOf()', todaysData.impression.valueOf());

                console.log('yesterdayData.impression', yesterdayData.impression);
                console.log('yesterdayData.impression.valueOf()',
                  yesterdayData.impression.valueOf());

                console.log('todaysData.click', todaysData.click);
                console.log('todaysData.click.valueOf()', todaysData.click.valueOf());

                console.log('yesterdayData.click', yesterdayData.click);
                console.log('yesterdayData.click.valueOf()', yesterdayData.click.valueOf());

                returnData.impressions = {};
                returnData.impressions.value = todaysData.impression
                  ? todaysData.impression.valueOf() : 0;

                returnData.impressions.yesterday = yesterdayData.impression ?
                  yesterdayData.impression.valueOf() : 0;
                console.log('impression yesterday', returnData.impressions.yesterday);
                if (returnData.impressions.yesterday !== 0) {
                  console.log('calculating change; Impression');
                  returnData.impressions.change = (returnData.impressions.value !== 0) ?
                  ((returnData.impressions.value - returnData.impressions.yesterday)
                  * 100) / returnData.impressions.yesterday : -100;
                } else {
                  if (returnData.impressions.value !== 0) {
                    returnData.impressions.change = 100;
                  } else {
                    console.log('change impression is 0');
                    returnData.impressions.change = 0;
                  }
                }

                returnData.impressions.yesterdaytotal = yesterdayTotalData.impression ?
                yesterdayTotalData.impression.valueOf() : 0;
                returnData.clicks = {};
                returnData.clicks.value = todaysData.click ? todaysData.click.valueOf() : 0;
                returnData.clicks.yesterday = yesterdayData.click ?
                yesterdayData.click.valueOf() : 0;
                if (returnData.clicks.yesterday !== 0) {
                  returnData.clicks.change = (returnData.clicks.value !== 0) ?
                    ((returnData.clicks.value - returnData.clicks.yesterday) * 100)
                    / yesterdayData.click : -100;
                } else {
                  if (returnData.clicks.value !== 0) {
                    returnData.clicks.change = 100;
                  } else {
                    returnData.clicks.change = 0;
                  }
                }

                returnData.clicks.yesterdaytotal = yesterdayTotalData.click ?
                yesterdayTotalData.click.valueOf() : 0;

                returnData.spend = {};
                returnData.spend.value = todaysData.spend ?
                  (todaysData.spend.valueOf() / 1000000) : 0;

                returnData.spend.yesterday = yesterdayData.spend ?
                  (yesterdayData.spend.valueOf() / 1000000) : 0;
                if (returnData.spend.yesterday !== 0) {
                  returnData.spend.change = (returnData.spend.value !== 0) ?
                  ((returnData.spend.value - returnData.spend.yesterday) * 100)
                  / returnData.spend.yesterday : -100;
                } else {
                  if (returnData.spend.value !== 0) {
                    returnData.spend.change = 100;
                  } else {
                    returnData.spend.change = 0;
                  }
                }

                returnData.spend.yesterdaytotal = yesterdayTotalData.spend ?
                  (yesterdayTotalData.spend / 1000000) : 0;

                returnData.ctr = {};

                console.log('impression value ', returnData.impressions.value);
                const todayCTR = (returnData.impressions.value !== 0) ?
                ((returnData.clicks.value / returnData.impressions.value) * 100) : 0;
                returnData.ctr.value = todayCTR;
                const yesterdayCTR = returnData.clicks.yesterday ?
                ((returnData.clicks.yesterday / returnData.impressions.yesterday) * 100) : 0;
                returnData.ctr.yesterday = yesterdayCTR;

                if (yesterdayCTR !== 0) {
                  returnData.ctr.change = (todayCTR !== 0) ?
                    ((todayCTR - yesterdayCTR) * 100)
                    / yesterdayCTR : -100;
                } else {
                  if (todayCTR !== 0) {
                    returnData.ctr.change = 100;
                  } else {
                    returnData.ctr.change = 0;
                  }
                }

                const yesterdayTotalCTR = returnData.clicks.yesterdaytotal ?
                ((yesterdayTotalData.click / yesterdayTotalData.impression) * 100) : 0;

                returnData.ctr.yesterdaytotal = yesterdayTotalCTR;

                returnData.cpc = {};
                const todayCPC = (returnData.clicks.value !== 0) ?
                  ((todaysData.spend / 1000000) / returnData.clicks.value) : 0;
                returnData.cpc.value = todayCPC;
                const yesterdayCPC = (returnData.clicks.yesterday !== 0) ?
                  (((yesterdayData.spend / 1000000) / returnData.clicks.yesterday)) : 0;

                returnData.cpc.yesterday = yesterdayCPC;
                console.log('todaycpc:', yesterdayCPC);
                if (yesterdayCPC !== 0) {
                  returnData.cpc.change = (todayCPC !== 0) ?
                    ((todayCPC - yesterdayCPC) * 100) / yesterdayCPC : -100;
                } else {
                  if (todayCPC !== 0) {
                    returnData.cpc.change = 100;
                  } else {
                    returnData.cpc.change = 0;
                  }
                }

                const yesterdayTotalCPC = (returnData.clicks.yesterdaytotal !== 0) ?
                (((yesterdayTotalData.spend / 1000000) / yesterdayTotalData.click)) : 0;

                returnData.cpc.yesterdaytotal = yesterdayTotalCPC;

                callback(null, returnData);
              });
          });
      });
  };

  this.getUniqueReachFromRedis = (startDate, endDate, customerId, campaignName, callback) => {
    const util = new Util();
    util.getKeyFromRedis(startDate, endDate, customerId, campaignName, (err, results) => {
      if (err) {
        callback(err, null);
      }

      callback(null, results);
    });
  };
}

export default CampaignRealTimeDAO;


import { siteAnalyticsGraphQuery, siteAnalyticsCityWiseQuery } from '../../../config';
import postgres from '../../db';
import Util from '../../../api/util';

function SiteAnalyticsDAO() {
  this.getSiteAnalyticsPerformanceFromRedis = (startDate, endDate, customerId, callback) => {
    console.log('Customer ID: ', customerId);
    console.log('start date', startDate);
    console.log('end date', endDate);
    console.log('Connecting with database');
    const returnData = {};
    const util = new Util();
    util.getKeyFromRedis(startDate, endDate, customerId, '0',
      (err, results) => {
        returnData.visitors = results;
        util.getKeyFromRedis(startDate, endDate, customerId, 'Buyers', (bErr, bResults) => {
          if (bErr) {
            callback(bErr, null);
          }

          returnData.buyers = bResults;
          util.getKeyFromRedis(startDate, endDate, customerId, 'Cart Users',
            (cErr, cResults) => {
              if (cErr) {
                callback(cErr, null);
              }

              returnData.cartusers = cResults;
              callback(null, returnData);
            });
        });
      });
  };

  this.getSiteAnalyticsCityWiseData = (startDate, endDate, customerId, callback) => {
    console.log('Customer ID: ', customerId);
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
      console.log('Site Analytics City Wise Query: ', siteAnalyticsCityWiseQuery);

      client.query(siteAnalyticsCityWiseQuery, startDate, endDate, customerId)
        .then((results) => {
          const returnData = {};
          returnData.data = [];
          let tempDate = new Date();
          if (results.rows.length > 0) {
            let cityData = {};
            for (let i = 0; i < results.rows.length; i++) {
              const data = results.rows[i];
              const dateLog = new Date(results.rows[i].time_sql_date);
              const dotw = weekDay[dateLog.getDay()];
              const month = (dateLog.getMonth() + 1) < 10
                ? `0${dateLog.getMonth() + 1}` : `${dateLog.getMonth() + 1}`;
              const day = dateLog.getDate();
              if (tempDate.valueOf() !== dateLog.valueOf()) {
                if (i !== 0) {
                  returnData.data.push(cityData);
                }

                cityData = {};
                tempDate = dateLog;
                cityData.date = data.time_sql_date;
                cityData.label = `${day}/${month}`;
                cityData.dotw = dotw;

                if (!data.citytype) {
                  cityData.Rural = data.visitorbycity;
                } else {
                  if (data.citytype === 'Tier 1') {
                    cityData.tier1 = data.visitorbycity;
                  } else if (data.citytype === 'Tier 2') {
                    cityData.tier2 = data.visitorbycity;
                  }
                }
              } else {
                if (!data.citytype) {
                  cityData.Rural = data.visitorbycity;
                } else {
                  if (data.citytype === 'Tier 1') {
                    cityData.tier1 = data.visitorbycity;
                  } else if (data.citytype === 'Tier 2') {
                    cityData.tier2 = data.visitorbycity;
                  }
                }

                if (i === results.rows.length - 1) {
                  returnData.data.push(cityData);
                }

                console.log(cityData);
              }
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

  this.getSiteAnalyticsDataByDateRange = (startDate, endDate, customerId, callback) => {
    const weekDay = new Array(7);
    weekDay[0] = 'Sun';
    weekDay[1] = 'Mon';
    weekDay[2] = 'Tue';
    weekDay[3] = 'Wed';
    weekDay[4] = 'Thu';
    weekDay[5] = 'Fri';
    weekDay[6] = 'Sat';
    console.log('Customer ID: ', customerId);
    console.log('start date', startDate);
    console.log('end date', endDate);
    console.log('Connecting with database');

    postgres.connect(async(client, err) => {
      if (err) {
        console.warn('Could not connect to postgres sql server');
        console.warn(err);
        callback(err, null);
      }
      console.log('Site Analytics Graph Query: ', siteAnalyticsGraphQuery);

      client.query(siteAnalyticsGraphQuery, startDate, endDate, customerId)
        .then((results) => {
          console.log(results);
          const returnData = {};
          returnData.visitors = {};
          returnData.visitors.label = 'Visitors';
          returnData.visitors.data = [];
          returnData.views = {};
          returnData.views.label = 'Views';
          returnData.views.data = [];

          if (results.rows.length > 0) {
            for (let i = 0; i < results.rows.length; i++) {
              const data = results.rows[i];
              const dateLog = new Date(results.rows[i].time_sql_date);
              const dotw = weekDay[dateLog.getDay()];
              const month = (dateLog.getMonth() + 1) < 10
                ? `0${dateLog.getMonth() + 1}` : `${dateLog.getMonth() + 1}`;
              const day = dateLog.getDate();

              if (i === 0) {
                returnData.visitors.start = data.time_sql_date;
                returnData.views.start = data.time_sql_date;
              }

              if (i === results.rows.length - 1) {
                returnData.visitors.end = data.time_sql_date;
                returnData.views.end = data.time_sql_date;
              }

              const visitorData = {};
              visitorData.date = data.time_sql_date;
              visitorData.value = data.visitors;
              visitorData.dotw = dotw;
              visitorData.label = `${day}/${month}`;
              const pvsData = {};
              pvsData.date = data.time_sql_date;
              pvsData.value = data.pvs;
              pvsData.dotw = dotw;
              pvsData.label = `${day}/${month}`;
              returnData.views.data.push(pvsData);
              returnData.visitors.data.push(visitorData);
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
}

export default SiteAnalyticsDAO;

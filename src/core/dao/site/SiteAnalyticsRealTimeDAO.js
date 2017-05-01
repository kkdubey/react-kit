import { siteRealTimeDBQuery, siteRealTimeDBTotalQuery, onemediaTimeZone } from '../../../config';
import CassandraClient from '../../dao/CassandraClient';
import _ from 'lodash';
import moment from 'moment-timezone';

function SiteAnalyticsRealTimeDAO() {
  this.getTodaysStatsForSite = (advertiser, callback) => {
    const cassandraClient = new CassandraClient();
    const today = moment().tz(onemediaTimeZone).format('YYYY-MM-DD');
    const yesterday = moment().tz(onemediaTimeZone).subtract(1, 'days')
      .format('YYYY-MM-DD');

    const timeHour = moment().tz(onemediaTimeZone).get('hour');
    console.log('today', today);
    console.log('yesterday', yesterday);
    console.log('onemediaTimeZone', onemediaTimeZone);
    console.log('timeHour', timeHour);

    const returnData = {};

    cassandraClient.queryRealTimeDB(siteRealTimeDBQuery, [today, timeHour, advertiser, '0'], (err, results) => { // eslint-disable-line
      if (err) {
        return callback(err, null);
      }

      let todayVisitorData = {};
      if (results.rowLength > 0) {
        todayVisitorData = results.rows[0];
      }

      cassandraClient.queryRealTimeDB(siteRealTimeDBQuery, [today, timeHour, advertiser, 'Buyers'], (tbErr, tbResults) => { // eslint-disable-line
        if (tbErr) {
          return callback(tbErr, null);
        }

        let todayBuyerData = {};
        if (tbResults.rowLength > 0) {
          todayBuyerData = tbResults.rows[0];
        }

        cassandraClient.queryRealTimeDB(siteRealTimeDBQuery, [today, timeHour, advertiser, 'Cart Users'], (cuErr, cuResults) => { // eslint-disable-line
          if (cuErr) {
            return callback(cuErr, null);
          }

          console.log(cuResults);
          let todayCartUserData = {};
          if (cuResults.rowLength > 0) {
            todayCartUserData = cuResults.rows[0];
          }

          cassandraClient.queryRealTimeDB(siteRealTimeDBQuery, [yesterday, timeHour, advertiser, '0'], (yErr, yResults) => { // eslint-disable-line
            if (yErr) {
              return callback(yErr, null);
            }

            let yesterdayVisitorData = {};
            if (yResults.rowLength > 0) {
              yesterdayVisitorData = yResults.rows[0];
            }

            cassandraClient.queryRealTimeDB(siteRealTimeDBQuery, [yesterday, timeHour, advertiser, 'Buyers'], (ybErr, ybResults) => { // eslint-disable-line
              if (ybErr) {
                return callback(ybErr, null);
              }

              let yesterdayBuyerData = {};
              if (ybResults.rowLength > 0) {
                yesterdayBuyerData = ybResults.rows[0];
              }

              cassandraClient.queryRealTimeDB(siteRealTimeDBQuery,
                [yesterday, timeHour, advertiser, 'Cart Users'], (ycuErr, ycuResults) => { // eslint-disable-line
                  if (ycuErr) {
                    return callback(ycuErr, null);
                  }

                  console.log(ycuResults);
                  let yesterdayCartUserData = {};
                  if (ycuResults.rowLength > 0) {
                    yesterdayCartUserData = ycuResults.rows[0];
                  }

                  let yesterdayTotalVisitorData = {};
                  cassandraClient.queryRealTimeDB(siteRealTimeDBTotalQuery, [yesterday,
                      advertiser, '0'], (ytovErr, ytovResults) => { // eslint-disable-line
                        if (ytovErr) {
                          return callback(ytovErr, null);
                        }

                        if (ytovResults.rowLength > 0) {
                          yesterdayTotalVisitorData = ytovResults.rows[0];
                        }

                        let yesterdayTotalBuyerData = {};

                        cassandraClient.queryRealTimeDB(siteRealTimeDBTotalQuery, [yesterday,
                        advertiser, 'Buyers'], (ytobErr, ytobResults) => { // eslint-disable-line
                          if (ytobErr) {
                            return callback(ytobErr, null);
                          }

                          if (ytobResults.rowLength > 0) {
                            yesterdayTotalBuyerData = ytobResults.rows[0];
                          }

                          let yesterdayTotalCartUsersData = {};

                          cassandraClient.queryRealTimeDB(siteRealTimeDBTotalQuery, [yesterday,
                            advertiser, 'Cart Users'], (ytocError, ytocResults) => {
                              if (ytocError) {
                                return callback(ytocError, null);
                              }

                              if (ytocResults.rowLength > 0) {
                                yesterdayTotalCartUsersData = ytocResults.rows[0];
                              }

                              returnData.visitors = {};
                              if (!_.isEmpty(todayVisitorData)) {
                                returnData.visitors.value = todayVisitorData.pv.valueOf();
                                if (!_.isEmpty(yesterdayVisitorData)) {
                                  returnData.visitors.yesterday = yesterdayVisitorData.pv.valueOf();
                                  returnData.visitors.change = ((todayVisitorData.pv
                                    - yesterdayVisitorData.pv) / yesterdayVisitorData.pv) * 100;
                                } else {
                                  returnData.visitors.yesterday = 0;
                                  returnData.visitors.change = 0;
                                }
                              } else {
                                returnData.visitors.value = 0;

                                if (!_.isEmpty(yesterdayVisitorData)) {
                                  returnData.visitors.yesterday = yesterdayVisitorData.pv.valueOf();
                                } else {
                                  returnData.visitors.yesterday = 0;
                                }

                                returnData.visitors.change = 0;
                              }

                              if (!_.isEmpty(yesterdayTotalVisitorData)) {
                                returnData.visitors.yesterdaytotal = yesterdayTotalVisitorData.
                                  pv.valueOf();
                              } else {
                                returnData.visitors.yesterdaytotal = 0;
                              }

                              returnData.buyers = {};
                              if (!_.isEmpty(todayBuyerData)) {
                                returnData.buyers.value = todayBuyerData.pv.valueOf();
                                if (!_.isEmpty(yesterdayBuyerData)) {
                                  returnData.buyers.yesterday = yesterdayBuyerData.pv.valueOf();
                                  returnData.buyers.change = ((todayBuyerData.pv -
                                    yesterdayBuyerData.pv) / yesterdayBuyerData.pv) * 100;
                                } else {
                                  returnData.buyers.yesterday = 0;
                                  returnData.buyers.change = 0;
                                }
                              } else {
                                returnData.buyers.value = 0;
                                if (!_.isEmpty(yesterdayBuyerData)) {
                                  returnData.buyers.yesterday = yesterdayBuyerData.pv.valueOf();
                                } else {
                                  returnData.buyers.yesterday = 0;
                                }

                                returnData.buyers.change = 0;
                              }

                              if (!_.isEmpty(yesterdayTotalBuyerData)) {
                                returnData.buyers.yesterdaytotal = yesterdayTotalBuyerData.
                                  pv.valueOf();
                              } else {
                                returnData.buyers.yesterdaytotal = 0;
                              }

                              returnData.cartusers = {};
                              if (!_.isEmpty(todayCartUserData)) {
                                returnData.cartusers.value = todayCartUserData.pv.valueOf();
                                if (!_.isEmpty(yesterdayCartUserData)) {
                                  returnData.cartusers.yesterday = yesterdayCartUserData.
                                    pv.valueOf();
                                  returnData.cartusers.change = ((todayCartUserData.pv - yesterdayCartUserData.pv) / yesterdayCartUserData.pv) * 100; // eslint-disable-line
                                } else {
                                  returnData.cartusers.yesterday = 0;
                                  returnData.cartusers.change = 0;
                                }
                              } else {
                                returnData.cartusers.value = 0;
                                if (!_.isEmpty(yesterdayCartUserData)) {
                                  returnData.cartusers.yesterday = yesterdayCartUserData.
                                    pv.valueOf();
                                } else {
                                  returnData.cartusers.yesterday = 0;
                                }

                                returnData.cartusers.change = 0;
                              }

                              if (!_.isEmpty(yesterdayTotalCartUsersData)) {
                                returnData.cartusers.yesterdaytotal = yesterdayTotalCartUsersData.
                                  pv.valueOf();
                              } else {
                                returnData.cartusers.yesterdaytotal = 0;
                              }

                              console.log('return Data: ', returnData);
                              return callback(null, returnData);
                            });
                        });
                      });
                });
            });
          });
        });
      });
    });
  };
}

export default SiteAnalyticsRealTimeDAO;

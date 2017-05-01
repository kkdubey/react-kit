import { Router } from 'express';
import mongoose from 'mongoose';
import SiteAnalyticsDAO from '../../core/dao/site/SiteAnalyticsDAO';
import User from '../../core/models/UserModel';
const router = new Router();
import SiteAnalyticsRealTimeDAO from '../../core/dao/site/SiteAnalyticsRealTimeDAO';

router.get('/:channel/dummystats', async(req, res, next) => {
  try {
    /* eslint-disable no-console */
    console.log('Site Analytics api call');
    const start = new Date(Date.parse(req.query.startdate));
    const end = new Date(Date.parse(req.query.enddate));
    const channel = req.params.channel;
    /* eslint-disable no-console */
    console.log('Start: ', start);
    console.log('End: ', end);
    console.log('Received channel : ', channel);

    const results = {};

    // top metrics data
    const metricData = {};
    metricData.visitors = Math.floor(Math.random() * (150000 - 30000 + 1) + 30000);
    metricData.cartusers = Math.floor(Math.random() * (1500 - 300 + 1) + 1500);
    metricData.buyers = Math.floor(Math.random() * (750 - 150 + 1) + 750);
    results.metrics = metricData;

    // today's metric data
    const todayMetric = {};

    todayMetric.date = new Date();
    todayMetric.buyers = {};
    todayMetric.buyers.value = Math.floor(Math.random() * (1500 - 800 + 1) + 1500);
    todayMetric.buyers.yesterday = todayMetric.buyers.value + 400;
    todayMetric.buyers.yesterdaytotal = todayMetric.buyers.value + 800;
    todayMetric.buyers.change = Math.random().toFixed(2) * (1);

    todayMetric.cartusers = {};
    todayMetric.cartusers.value = Math.floor(Math.random() * (3000 - 2000 + 1) + 2000);
    todayMetric.cartusers.yesterday = todayMetric.cartusers.value + 500;
    todayMetric.cartusers.yesterdaytotal = todayMetric.cartusers.value + 2000;
    todayMetric.cartusers.change = Math.random().toFixed(2) * (-1);

    todayMetric.visitors = {};
    todayMetric.visitors.value = Math.floor(Math.random() * (1500000 - 800000 + 1) + 1500000);
    todayMetric.visitors.yesterday = todayMetric.visitors.value + 400000;
    todayMetric.visitors.yesterdaytotal = todayMetric.visitors.value + 800000;
    todayMetric.visitors.change = Math.random().toFixed(2) * (1);

    results.today = todayMetric;
    const shortWeekDaysNameArray = new Array(7);
    shortWeekDaysNameArray[0] = 'Sun';
    shortWeekDaysNameArray[1] = 'Mon';
    shortWeekDaysNameArray[2] = 'Tue';
    shortWeekDaysNameArray[3] = 'Wed';
    shortWeekDaysNameArray[4] = 'Thu';
    shortWeekDaysNameArray[5] = 'Fri';
    shortWeekDaysNameArray[6] = 'Sat';

    const visitorsArray = [];
    const viewsArray = [];
    const visitorsByCity = [];

    for (let dateCounter = start; dateCounter <= end;) {
      const newDate = new Date(dateCounter);
      const dotw = shortWeekDaysNameArray[dateCounter.getDay()];
      const month = (newDate.getMonth() + 1) < 10 ? `0${newDate.getMonth() + 1}` : `${newDate.getMonth() + 1}`; // eslint-disable-line
      const day = (newDate.getDate()) < 10 ? `0${newDate.getDate()}` : `${newDate.getDate()}`;
      const label = `${day}/${month}`;

      const visitors = {};
      visitors.value = Math.floor(Math.random() * (15000 - 3000 + 1) + 15000);
      visitors.date = newDate;
      visitors.dotw = dotw;
      visitors.label = label;
      visitorsArray.push(visitors);

      const views = {};
      views.value = Math.floor(Math.random() * (1000 - 500 + 1) + 500);
      views.date = newDate;
      views.dotw = dotw;
      views.label = label;
      viewsArray.push(views);

      const tierData = {};
      tierData.tier1 = Math.floor(Math.random() * (15000 - 3000 + 1) + 15000);
      tierData.tier2 = Math.floor(Math.random() * (15000 - 3000 + 1) + 15000);
      tierData.date = newDate;
      tierData.dotw = dotw;
      tierData.label = label;

      visitorsByCity.push(tierData);
      dateCounter.setDate(dateCounter.getDate() + 1);
    }

    const visitorsByAge = [];

    visitorsByAge.push({ name: '18-25', value: 32 });
    visitorsByAge.push({ name: '25-35', value: 25 });
    visitorsByAge.push({ name: '35-45', value: 13 });
    visitorsByAge.push({ name: '45-60', value: 30 });

    const visitorsByIncomeGroup = [];

    visitorsByIncomeGroup.push({ name: 'Low', value: 20 });
    visitorsByIncomeGroup.push({ name: 'Middle', value: 12 });
    visitorsByIncomeGroup.push({ name: 'High', value: 54 });
    visitorsByIncomeGroup.push({ name: 'Unknown', value: 14 });

    results.data = {};
    results.data.visitors = {};
    results.data.visitors.data = visitorsArray;
    results.data.visitors.label = 'Visitors';
    results.data.order = 1;

    results.data.views = {};
    results.data.views.data = viewsArray;
    results.data.views.label = 'Views';
    results.data.order = 2;

    results.data.visitorsbycity = {};
    results.data.visitorsbycity.data = visitorsByCity;
    results.data.visitorsbycity.label = 'Visitors by City';
    results.data.order = 3;

    results.data.visitorsbyage = {};
    results.data.visitorsbyage.data = visitorsByAge;
    results.data.visitorsbyage.label = 'Visitors by Age';
    results.data.order = 4;

    results.data.visitorsbyincomegroup = {};
    results.data.visitorsbyincomegroup.data = visitorsByIncomeGroup;
    results.data.visitorsbyincomegroup.label = 'Visitors by Income Group';
    results.data.order = 5;

    return res.json({
      status: 'OK',
      results,
    });
  } catch (err) {
    next(err);
    return false;
  }
});

router.get('/:userid/stats', async(req, res, next) => { // eslint-disable-line
  try {
    // const start = new Date(Date.parse(req.query.startdate));
    const start = req.query.startdate;

    // const end = new Date(Date.parse(req.query.enddate));
    const end = req.query.enddate;
    const channel = req.params.channel;
    const userId = new mongoose.Types.ObjectId(req.params.userid);
    console.log('Start: ', start);
    console.log('End: ', end);
    console.log('Received channel : ', channel);
    const returnData = {};
    const siteAnalyticsDAO = new SiteAnalyticsDAO();
    const siteAnalyticsRTDAO = new SiteAnalyticsRealTimeDAO();

    User.findOne({ _id: userId },
      'customer_id', (err, doc) => { // eslint-disable-line
        if (err) {
          return res.status(404)
            .send({ message: 'Not able to find the user' });
        }

        const customerId = doc.customer_id;

        // siteAnalyticsDAO.getSiteAnalyticsPerformanceData(start, end, customerId,
        siteAnalyticsDAO.getSiteAnalyticsPerformanceFromRedis(start, end, customerId,
          (siteErr, siteData) => { // eslint-disable-line
            if (siteErr) {
              return res.status(500)
                .send({ message: 'Not able to return results' });
            }

            returnData.metrics = siteData;

            siteAnalyticsDAO.getSiteAnalyticsDataByDateRange(start, end, customerId,
              (dataErr, dateWiseData) => {
                returnData.data = dateWiseData;
                siteAnalyticsDAO.getSiteAnalyticsCityWiseData(start, end, customerId,
                  (cityErr, cityWiseData) => { // eslint-disable-line
                    if (cityErr) {
                      return res.status(500)
                        .send({ message: 'Not able to return results' });
                    }

                    returnData.data.visitorsbycity = cityWiseData;
                    siteAnalyticsRTDAO.getTodaysStatsForSite(customerId,
                      (todayError, todayData) => {
                        returnData.today = todayData;
                        return res.json({
                          status: 'OK',
                          results: returnData,
                        });
                      });
                  });
              });
          });
      });
  } catch (err) {
    next(err);
    return false;
  }
});
export default router;

import {
  FETCH_SITE_REPORT_START,
  FETCH_SITE_REPORT_SUCCESS,
  FETCH_SITE_REPORT_FAILED,
} from '../constants';
import moment from 'moment';

export function fetchSiteReport(userId, apiMode,
  startDate = moment().subtract(7, 'days').format('YYYY-MM-DD'),
  endDate = moment().format('YYYY-MM-DD')) {
  return async (dispatch) => {
    dispatch({
      type: FETCH_SITE_REPORT_START,
      payload: {
        userId,
      },
    });

    try {
      let url = '';
      console.log('******* apiMode: *****', apiMode);
      const random = Math.random();
      if (apiMode === 'dummy') {
        url = `/api/sa/${userId}/dummystats?` +
              `startdate=${startDate}&enddate=${endDate}&random=${random}`;
      } else {
        url = `/api/sa/${userId}/stats?` +
              `startdate=${startDate}&enddate=${endDate}&random=${random}`;
      }

      const obj = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          crossDomain: true,
        },
        credentials: 'include',
      };

      console.log('******* url: *****', url);
      const response = await fetch(url, obj);
      const siteAnalyticsData = await response.json();

      dispatch({
        type: FETCH_SITE_REPORT_SUCCESS,
        payload: {
          userId,
          siteAnalyticsData,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_SITE_REPORT_FAILED,
        payload: {
          userId,
          error,
        },
      });
      return false;
    }

    return true;
  };
}


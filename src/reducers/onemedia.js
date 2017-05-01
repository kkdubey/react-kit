import {
  USER_LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  USER_LOG_OUT,
  FETCH_CAMPAIGN_LIST_SUCCESS,
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_START,
  UPDATE_CAMPAIGN_FAILED,
  SNACKBAR_CLOSE,
  FETCH_CAMPAIGN_REPORT_SUCCESS,
  FETCH_SITE_REPORT_SUCCESS,
  FETCH_STATIC_DATA_SUCCESS,
  FETCH_TARGET_REACH_SUCCESS,
  NEW_CAMPAIGN_START,
  COPY_FROM_CAMPAIGN_START,
  EDIT_CAMPAIGN_START,
  OBJECTIVE_FIELD_UPDATED,
  ADD_CREATIVES,
  REMOVE_CREATIVE,
  TARGET_SIMPLE_FIELD_UPDATED,
  TARGET_ARRAY_FIELD_UPDATED,
  LOCATION_SIMPLE_FIELD_UPDATED,
  LOCATION_ARRAY_FIELD_UPDATED,
  BUDGET_SIMPLE_FIELD_UPDATED,
  SCHEDULE_SIMPLE_FIELD_UPDATED,
  FREQUENCYCAP_USER_FIELD_UPDATED,
  FREQUENCYCAP_SESSION_FIELD_UPDATED,
  SAVE_CAMPAIGN_START,
  SAVE_CAMPAIGN_SUCCESS,
  SAVE_CAMPAIGN_FAILED,
  ADD_MARKER,
  REMOVE_MARKER,
} from '../constants';
import Location from '../core/history';

export default function onemedia(state = null, action) {
  if (state === null) {
    return {
      email: 'unidentified',
      loggedInUser: { status: 'user_not_logged_in', user: { } },
      disableFeatures: true,
      loginErrorMessage: '',
      snackBarMessage: '',
      activeCampaigns: [],
      archiveCampaigns: [],
      campaignGraphDataSet: [],
      reachFrom: 100000,
      reachTo: 100000,
      showSavingInProgress: false,
      isEditingCampaign: false,
      creatives: [],
      budget: {
        currency: '',
        total: '',
        cpm: '',
        campaign_budget_upload: '',
      },
      target: {
        gender: 'all',
        income_group: [],
        tags: [],
        tagsInclude: true,
        agegroup: [],
        interests: ['Travel'],
        interestsInclude: true,
        websites: [],
        webSitesInclude: true,
      },
      fequencyCapUser: {
        total_views: '',
        daily_views: '',
      },
      fequencyCapSession: {
        total_views: '',
      },
      location: {
        cities: [],
        locationInclude: [],
        markers: [],
      },
      schedule: {
        startdate: '',
        enddate: '',
        starttime: '',
        endtime: '',
        campaign_schedule_upload: '',
      },
      objective: {
        campaign_name: '',
        campaign_objective: '',
        campaign_type: 'Web',
        campaign_brand_category: '',
      },
    };
  }

  switch (action.type) {
    case USER_LOGIN_START: {
      const email = state[action.payload.email] ? action.payload.email : state.email;
      return {
        ...state,
        email,
        loggedInUser: { status: 'log_in_pending', user: { } },
        loginErrorMessage: '',
      };
    }

    case LOGIN_SUCCESS: {
      if (typeof (global.Storage) !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify(action.payload.user));
      }

      Location.push({
        pathname: '/AdminHome',
        state: { user: action.payload.user },
      });
      return {
        ...state,
        email: action.payload.email,
        loggedInUser: action.payload.user,
        disableFeatures: action.payload.email.indexOf('onedigitalad.com') === -1,
        loginErrorMessage: 'User login successfully',
      };
    }

    case LOGIN_FAILED: {
      return {
        ...state,
        loggedInUser: { status: action.payload.error, user: { } },
        disableFeatures: true,
        loginErrorMessage: action.payload.error,
      };
    }

    case USER_LOG_OUT: {
      if (typeof (global.Storage) !== 'undefined') {
        sessionStorage.setItem('user', '');
      }

      Location.push({
        pathname: '/Signin',
      });

      return {
        ...state,
        loggedInUser: { status: 'user_logged_out', user: { } },
        disableFeatures: true,
        loginErrorMessage: '',
      };
    }

    case FETCH_CAMPAIGN_LIST_SUCCESS: {
      return {
        ...state,
        activeCampaigns: action.payload.activeCampaigns,
        archiveCampaigns: action.payload.archiveCampaigns,
      };
    }

    case UPDATE_CAMPAIGN_SUCCESS: {
      let activeCampaigns = state.activeCampaigns;
      activeCampaigns = activeCampaigns.map((campaign) => {
        if (campaign._id === action.payload.campaignId) {
          return Object.assign({}, campaign, {
            campaign_running_status: action.payload.status,
            statusUpdating: false,
          });
        }

        return campaign;
      });

      let archiveCampaigns = state.archiveCampaigns;
      archiveCampaigns = archiveCampaigns.map((campaign) => {
        if (campaign._id === action.payload.campaignId) {
          return Object.assign({}, campaign, {
            campaign_running_status: action.payload.status,
            statusUpdating: false,
          });
        }

        return campaign;
      });

      return {
        ...state,
        activeCampaigns,
        archiveCampaigns,
        snackBarMessage: action.payload.message,
      };
    }

    case UPDATE_CAMPAIGN_START: {
      let activeCampaigns = state.activeCampaigns;
      activeCampaigns = activeCampaigns.map((campaign) => {
        if (campaign._id === action.payload.campaignId) {
          return Object.assign({}, campaign, {
            statusUpdating: true,
          });
        }

        return campaign;
      });

      let archiveCampaigns = state.archiveCampaigns;
      archiveCampaigns = archiveCampaigns.map((campaign) => {
        if (campaign._id === action.payload.campaignId) {
          return Object.assign({}, campaign, {
            statusUpdating: true,
          });
        }

        return campaign;
      });

      return {
        ...state,
        activeCampaigns,
        archiveCampaigns,
      };
    }

    case UPDATE_CAMPAIGN_FAILED: {
      let activeCampaigns = state.activeCampaigns;
      activeCampaigns = activeCampaigns.map((campaign) => {
        if (campaign._id === action.payload.campaignId) {
          return Object.assign({}, campaign, {
            statusUpdating: false,
          });
        }

        return campaign;
      });

      let archiveCampaigns = state.archiveCampaigns;
      archiveCampaigns = archiveCampaigns.map((campaign) => {
        if (campaign._id === action.payload.campaignId) {
          return Object.assign({}, campaign, {
            statusUpdating: false,
          });
        }

        return campaign;
      });

      return {
        ...state,
        activeCampaigns,
        archiveCampaigns,
        snackBarMessage: 'update Campaign Failed',
      };
    }

    case FETCH_CAMPAIGN_REPORT_SUCCESS: {
      const campaignGraphDataSet = action.payload.result.map(campaignStats => {
        const campaignGraphData = {};
        campaignGraphData.metrics = campaignStats.results.metrics;
        campaignGraphData.today = campaignStats.results.today;

        const impressionData = {
          datasets: [{
            data: [],
            fillColor: '#673AB7',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
          }],
          labels: [],
        };

        for (let i = 0; i < campaignStats.results.data.impressions.data.length; i++) {
          const campaignImpressionData = campaignStats.results.data.impressions.data[i];
          impressionData.datasets[0].data.push(campaignImpressionData.value);
          impressionData.labels.push(`${campaignImpressionData.dotw} ${campaignImpressionData.label}`); //  eslint-disable-line max-len
        }

        campaignGraphData.data = {};
        campaignGraphData.data.impressions = {};
        campaignGraphData.data.impressions.data = impressionData;

        const clickData = {
          datasets: [{
            data: [],
            fillColor: '#673AB7',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
          }],
          labels: [],
        };

        for (let i = 0; i < campaignStats.results.data.clicks.data.length; i++) {
          const campaignClicksData = campaignStats.results.data.clicks.data[i];
          clickData.datasets[0].data.push(campaignClicksData.value);
          clickData.labels.push(`${campaignClicksData.dotw} ${campaignClicksData.label}`);
        }

        campaignGraphData.data.clicks = {};
        campaignGraphData.data.clicks.data = clickData;

        const ctrData = {
          datasets: [{
            data: [],
            fillColor: '#673AB7',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
          }],
          labels: [],
        };

        for (let i = 0; i < campaignStats.results.data.ctr.data.length; i++) {
          const campaignCTRData = campaignStats.results.data.ctr.data[i];
          ctrData.datasets[0].data.push(campaignCTRData.value);
          ctrData.labels.push(`${campaignCTRData.dotw} ${campaignCTRData.label}`);
        }

        campaignGraphData.data.ctr = {};
        campaignGraphData.data.ctr.data = ctrData;

        const cpcData = {
          datasets: [{
            data: [],
            fillColor: '#673AB7',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
          }],
          labels: [],
        };

        for (let i = 0; i < campaignStats.results.data.clicks.data.length; i++) {
          const campaignCPCData = campaignStats.results.data.cpc.data[i];
          cpcData.datasets[0].data.push(campaignCPCData.value);
          cpcData.labels.push(`${campaignCPCData.dotw} ${campaignCPCData.label}`);
        }

        campaignGraphData.data.cpc = {};
        campaignGraphData.data.cpc.data = cpcData;
        return campaignGraphData;
      });
      return {
        ...state,
        campaignDashboardAPIStats: action.payload.result,
        campaignGraphDataSet,
      };
    }

    case FETCH_SITE_REPORT_SUCCESS: {
      const siteAnalyticsData = action.payload.siteAnalyticsData;
      const siteAnalyticsGraphData = {};

      siteAnalyticsGraphData.metrics = siteAnalyticsData.results.metrics;
      siteAnalyticsGraphData.today = siteAnalyticsData.results.today;
      siteAnalyticsGraphData.data = {};
      siteAnalyticsGraphData.data.visitors = {};
      siteAnalyticsGraphData.data.views = {};
      siteAnalyticsGraphData.data.visitorsbycity = {};

      siteAnalyticsGraphData.data.visitorsbyage = siteAnalyticsData.results.data.visitorsbyage;
      siteAnalyticsGraphData.data.visitorsbyincomegroup = siteAnalyticsData.results.data.visitorsbyincomegroup; //eslint-disable-line

      const visitorLineChartData = {
        datasets: [{
          data: [],
          fillColor: '#673AB7',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
        }],
        labels: [],
      };

      for (let i = 0; i < siteAnalyticsData.results.data.visitors.data.length; i++) {
        const siteVisitorData = siteAnalyticsData.results.data.visitors.data[i];
        visitorLineChartData.datasets[0].data.push(siteVisitorData.value);
        visitorLineChartData.labels.push(`${siteVisitorData.dotw} ${siteVisitorData.label}`);
      }

      siteAnalyticsGraphData.data.visitors.data = visitorLineChartData;

      const viewsLineChartData = {
        datasets: [{
          data: [],
          fillColor: '#673AB7',
          strokeColor: 'rgba(220,220,220,1)',
          pointColor: 'rgba(220,220,220,1)',
          pointStrokeColor: '#fff',
        }],
        labels: [],
      };

      for (let i = 0; i < siteAnalyticsData.results.data.views.data.length; i++) {
        const siteViewsData = siteAnalyticsData.results.data.views.data[i];
        viewsLineChartData.datasets[0].data.push(siteViewsData.value);
        viewsLineChartData.labels.push(`${siteViewsData.dotw} ${siteViewsData.label}`);
      }

      siteAnalyticsGraphData.data.views.data = viewsLineChartData;

      const visitorByCityChartData = {
        labels: [],
        datasets: [
          {
            label: 'Tier 1',
            fillColor: '#673AB7',
            strokeColor: '#FFFFFF',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: [],
          },
          {
            label: 'Tier 2',
            fillColor: 'rgba(179,136,255,0.5)',
            strokeColor: '#b388ff',
            pointColor: 'rgba(151,187,205,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(151,187,205,1)',
            data: [],
          },
        ],
      };

      for (let i = 0; i < siteAnalyticsData.results.data.visitorsbycity.data.length; i++) {
        const tierChartData = siteAnalyticsData.results.data.visitorsbycity.data[i];
        visitorByCityChartData.labels.push(`${tierChartData.dotw} ${tierChartData.label}`);
        visitorByCityChartData.datasets[0].data.push(tierChartData.tier1);
        visitorByCityChartData.datasets[1].data.push(tierChartData.tier2);
      }

      siteAnalyticsGraphData.data.visitorsbycity.data = visitorByCityChartData;
      return {
        ...state,
        siteReportsAPIStats: action.payload.siteAnalyticsData,
        siteAnalyticsGraphData,
      };
    }

    case FETCH_STATIC_DATA_SUCCESS: {
      const data = action.payload.responses.map(({ data: { key, values } }) => [key, values]);
      return {
        ...state,
        staticData: new Map(data),
      };
    }

    case FETCH_TARGET_REACH_SUCCESS: {
      return {
        ...state,
        reachFrom: action.payload.reachFrom,
        reachTo: action.payload.reachTo,
      };
    }

    case NEW_CAMPAIGN_START: {
      return {
        ...state,
        campaignForEdit: action.payload.campaign,
        isEditingCampaign: false,
      };
    }

    case COPY_FROM_CAMPAIGN_START: {
      const objective = Object.assign({}, state.objective, action.payload.objective);
      const creatives = action.payload.creatives.slice();
      const target = Object.assign({}, state.target, action.payload.target);
      const location = Object.assign({}, state.location, action.payload.location);
      const budget = Object.assign({}, state.budget, action.payload.budget);
      const schedule = Object.assign({}, state.schedule, action.payload.schedule);
      const fequencyCapUser = Object.assign({}, state.fequencyCapUser,
        action.payload.fequencyCapUser);
      const fequencyCapSession = Object.assign({}, state.fequencyCapSession,
        action.payload.fequencyCapSession);
      return {
        ...state,
        campaignForEdit: action.payload.campaign,
        isEditingCampaign: false,
        objective,
        creatives,
        target,
        location,
        budget, schedule, fequencyCapUser, fequencyCapSession,
      };
    }

    case EDIT_CAMPAIGN_START: {
      const objective = Object.assign({}, state.objective, action.payload.objective);
      const creatives = action.payload.creatives.slice();
      const target = Object.assign({}, state.target, action.payload.target);
      const location = Object.assign({}, state.location, action.payload.location);
      const budget = Object.assign({}, state.budget, action.payload.budget);
      const schedule = Object.assign({}, state.schedule, action.payload.schedule);
      const fequencyCapUser = Object.assign({}, state.fequencyCapUser,
        action.payload.fequencyCapUser);
      const fequencyCapSession = Object.assign({}, state.fequencyCapSession,
        action.payload.fequencyCapSession);
      return {
        ...state,
        campaignForEdit: action.payload.campaign,
        isEditingCampaign: true,
        objective,
        creatives,
        target,
        location,
        budget, schedule, fequencyCapUser, fequencyCapSession,
      };
    }

    case OBJECTIVE_FIELD_UPDATED: {
      const objective = Object.assign({}, state.objective, action.payload);
      return {
        ...state,
        objective,
      };
    }

    case ADD_CREATIVES: {
      return {
        ...state,
        creatives: [...state.creatives, action.payload],
      };
    }

    case REMOVE_CREATIVE: {
      return {
        ...state,
        creatives: state.creatives.filter(c => c._id !== action.payload._id),
      };
    }

    case TARGET_SIMPLE_FIELD_UPDATED: {
      const target = Object.assign({}, state.target, action.payload);
      return {
        ...state,
        target,
      };
    }

    case TARGET_ARRAY_FIELD_UPDATED: {
      const { isAddOperation, fieldName, fieldValue } = action.payload;
      const target = Object.assign({}, state.target);
      if (isAddOperation) {
        target[fieldName] = [...target[fieldName], fieldValue];
      } else {
        const index = target[fieldName].indexOf(fieldValue);
        if (index > -1) {
          target[fieldName] = [...target[fieldName].slice(0, index),
          ...target[fieldName].slice(index + 1)];
        }
      }

      return {
        ...state,
        target,
      };
    }

    case BUDGET_SIMPLE_FIELD_UPDATED: {
      const budget = Object.assign({}, state.budget, action.payload);
      return {
        ...state,
        budget,
      };
    }

    case SCHEDULE_SIMPLE_FIELD_UPDATED: {
      const schedule = Object.assign({}, state.schedule, action.payload);
      return {
        ...state,
        schedule,
      };
    }

    case FREQUENCYCAP_USER_FIELD_UPDATED: {
      const fequencyCapUser = Object.assign({}, state.fequencyCapUser, action.payload);
      return {
        ...state,
        fequencyCapUser,
      };
    }

    case FREQUENCYCAP_SESSION_FIELD_UPDATED: {
      const frequencyCapSession = Object.assign({}, state.frequencyCapSession, action.payload);
      return {
        ...state,
        frequencyCapSession,
      };
    }

    case LOCATION_SIMPLE_FIELD_UPDATED: {
      const location = Object.assign({}, state.location, action.payload);
      return {
        ...state,
        location,
      };
    }

    case LOCATION_ARRAY_FIELD_UPDATED: {
      const { isAddOperation, fieldName, fieldValue } = action.payload;
      const location = Object.assign({}, state.location);
      if (isAddOperation) {
        location[fieldName] = [...location[fieldName], fieldValue];
      } else {
        const index = location[fieldName].indexOf(fieldValue);
        if (index > -1) {
          location[fieldName] = [...location[fieldName].slice(0, index),
          ...location[fieldName].slice(index + 1)];
        }
      }

      return {
        ...state,
        location,
      };
    }

    case SAVE_CAMPAIGN_START: {
      return {
        ...state,
        snackBarMessage: 'Saving Campaign',
        showSavingInProgress: true,
      };
    }

    case SAVE_CAMPAIGN_SUCCESS: {
      Location.push({
        pathname: '/AdminHome',
      });
      return {
        ...state,
        snackBarMessage: action.payload.message,
        showSavingInProgress: false,
        isEditingCampaign: false,
      };
    }

    case SAVE_CAMPAIGN_FAILED: {
      return {
        ...state,
        snackBarMessage: action.payload.error,
        showSavingInProgress: false,
      };
    }

    case SNACKBAR_CLOSE: {
      return {
        ...state,
        snackBarMessage: '',
      };
    }

    case ADD_MARKER: {
      const x = state.location;
      x.markers = [...x.markers, action.payload];
      return {
        ...state,
        location: x,
      };
    }

    case REMOVE_MARKER : {
      const x = state.location;
      x.markers = state.location.markers.filter(c => c.key !== action.payload.key);
      return {
        ...state,
        location: x,
      };
    }

    default: {
      return state;
    }
  }
}

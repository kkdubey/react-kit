import {
  FETCH_CAMPAIGN_LIST_START,
  FETCH_CAMPAIGN_LIST_SUCCESS,
  FETCH_CAMPAIGNS_LIST_FAILED,
  UPDATE_CAMPAIGN_START,
  UPDATE_CAMPAIGN_SUCCESS,
  UPDATE_CAMPAIGN_FAILED,
  FETCH_CAMPAIGN_REPORT_START,
  FETCH_CAMPAIGN_REPORT_SUCCESS,
  FETCH_CAMPAIGN_REPORT_FAILED,
  NEW_CAMPAIGN_START,
  COPY_FROM_CAMPAIGN_START,
  EDIT_CAMPAIGN_START,
  OBJECTIVE_FIELD_UPDATED,
  ADD_CREATIVES,
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
  REMOVE_CREATIVE,
  ADD_MARKER,
  REMOVE_MARKER,
} from '../constants';
import moment from 'moment';

export function fetchCampaignsList(userid) {
  return async (dispatch) => {
    dispatch({
      type: FETCH_CAMPAIGN_LIST_START,
      payload: {
        userid,
      },
    });

    try {
      const obj = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          crossDomain: true,
        },
        credentials: 'include',
      };

      const responses = await Promise.all([
        fetch(`/api/campaign/list?userid=${userid}`, obj),
        fetch(`/api/campaign/archive?userid=${userid}`, obj),
      ]);
      if (responses[0].status === 200 && responses[1].status === 200) {
        const activeCampaigns = await responses[0].json();
        const archiveCampaigns = await responses[1].json();
        dispatch({
          type: FETCH_CAMPAIGN_LIST_SUCCESS,
          payload: {
            userid,
            activeCampaigns: activeCampaigns.campaigns,
            archiveCampaigns: archiveCampaigns.campaigns,
          },
        });
      } else {
        throw new Error(responses[0].statusText + responses[1].status);
      }
    } catch (error) {
      dispatch({
        type: FETCH_CAMPAIGNS_LIST_FAILED,
        payload: {
          userid,
          error,
        },
      });
      return false;
    }

    return true;
  };
}

export function updateCampaign(campaignId, status) {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_CAMPAIGN_START,
      payload: {
        campaignId,
      },
    });

    try {
      const obj = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          crossDomain: true,
        },
        credentials: 'include',
        body: JSON.stringify({
          campaignid: campaignId,
          status,
        }),
      };

      const url = '/api/campaign/status';
      const response = await fetch(url, obj);
      if (response.status === 200) {
        const data = await response.json();
        if (data.status === 'OK') {
          dispatch({
            type: UPDATE_CAMPAIGN_SUCCESS,
            payload: {
              campaignId,
              status,
              message: data.message,
            },
          });
        } else {
          dispatch({
            type: UPDATE_CAMPAIGN_FAILED,
            payload: {
              campaignId,
              status,
              error: data.message,
            },
          });
        }
      } else {
        throw new Error(response.status);
      }
    } catch (error) {
      dispatch({
        type: UPDATE_CAMPAIGN_FAILED,
        payload: {
          campaignId,
          status,
          error,
        },
      });
      return false;
    }

    return true;
  };
}

export function fetchCampaignReport(userId, apiMode, campaignList,
  startDate = moment().subtract(7, 'days').format('YYYY-MM-DD'),
  endDate = moment().format('YYYY-MM-DD')) {
  return async (dispatch) => {
    dispatch({
      type: FETCH_CAMPAIGN_REPORT_START,
      payload: {
        userId,
      },
    });

    try {
      Promise.all(campaignList.map(campaign => {
        let url = '';
        console.log('******* apiMode: *****', apiMode); // eslint-disable-line no-console
        const random = Math.random();
        if (apiMode === 'dummy') {
          url = `/api/dc/${campaign._id}/dummystats?startdate=${startDate}&enddate=${endDate}&random=${random}`; // eslint-disable-line
        } else {
          url = `/api/dc/${campaign._id}/stats?startdate=${startDate}&enddate=${endDate}&random=${random}`; // eslint-disable-line
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

        console.log('******* url: *****', url); // eslint-disable-line no-console
        return fetch(url, obj);
      }))
        .then(resp => Promise.all(resp.map(r => r.json())))
        .then(result => {
          dispatch({
            type: FETCH_CAMPAIGN_REPORT_SUCCESS,
            payload: {
              userId,
              result,
            },
          });
        });
    } catch (error) {
      dispatch({
        type: FETCH_CAMPAIGN_REPORT_FAILED,
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

export function fetchCampaignsListAndReports(userid, apiMode,
  startDate = moment().subtract(7, 'days').format('YYYY-MM-DD'),
  endDate = moment().format('YYYY-MM-DD')) {
  return async (dispatch) => {
    dispatch({
      type: FETCH_CAMPAIGN_LIST_START,
      payload: {
        userid,
      },
    });

    try {
      const obj = {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          crossDomain: true,
        },
        credentials: 'include',
      };

      const responses = await Promise.all([
        fetch(`/api/campaign/list?userid=${userid}`, obj),
        fetch(`/api/campaign/archive?userid=${userid}`, obj),
      ]);
      if (responses[0].status === 200 && responses[1].status === 200) {
        const activeCampaigns = await responses[0].json();
        const archiveCampaigns = await responses[1].json();
        dispatch({
          type: FETCH_CAMPAIGN_LIST_SUCCESS,
          payload: {
            userid,
            activeCampaigns: activeCampaigns.campaigns,
            archiveCampaigns: archiveCampaigns.campaigns,
          },
        });

        console.log(activeCampaigns);
        Promise.all(activeCampaigns.campaigns.map(campaign => {
          let url = '';
          console.log('******* apiMode: *****', apiMode); // eslint-disable-line no-console
          const random = Math.random();
          if (apiMode === 'dummy') {
            url = `/api/dc/${campaign._id}/dummystats?startdate=${startDate}&enddate=${endDate}&random=${random}`; // eslint-disable-line
          } else {
            url = `/api/dc/${campaign._id}/stats?startdate=${startDate}&enddate=${endDate}&random=${random}`; // eslint-disable-line
          }

          console.log('******* url: *****', url); // eslint-disable-line no-console
          return fetch(url, obj);
        }))
          .then(resp => Promise.all(resp.map(r => r.json())))
          .then(result => {
            dispatch({
              type: FETCH_CAMPAIGN_REPORT_SUCCESS,
              payload: {
                userid,
                result,
              },
            });
          });
      } else {
        throw new Error(responses[0].statusText + responses[1].status);
      }
    } catch (error) {
      dispatch({
        type: FETCH_CAMPAIGNS_LIST_FAILED,
        payload: {
          userid,
          error,
        },
      });
      return false;
    }

    return true;
  };
}

function populateFromCampaign(campaign) {
  const target = {
    gender: 'all',
    income_group: [],
    tags: [],
    tagsInclude: true,
    agegroup: [],
    interests: ['Travel'],
    interestsInclude: true,
    websites: [],
    webSitesInclude: true,
  };

  if (campaign.target) {
    if (campaign.target.include) {
      target.gender = campaign.target.include.gender;
      target.income_group = campaign.target.include.income_group;
      target.agegroup = campaign.target.include.agegroup;
    }

    if (campaign.target.include.tags && campaign.target.include.tags.length > 0) {
      target.tagsInclude = true;
      target.tags = campaign.target.include.tags;
    } else {
      target.tagsInclude = false;
      if (campaign.target.exclude) {
        target.tags = campaign.target.exclude.tags;
      } else {
        target.tags = [];
      }
    }

    if (campaign.target.include.interests && campaign.target.include.interests.length > 0) {
      target.interestsInclude = true;
      target.interests = campaign.target.include.interests;
    } else {
      target.interestsInclude = false;
      target.interests = campaign.target.exclude.interests;
    }

    if (campaign.target.include.websites && campaign.target.include.websites.length > 0) {
      target.webSitesInclude = true;
      target.websites = campaign.target.include.websites;
    } else {
      target.webSitesInclude = false;
      if (campaign.target.exclude) {
        target.websites = campaign.target.exclude.websites;
      } else {
        target.websites = [];
      }
    }
  }

  const objective = {
    campaign_name: campaign.campaign_name,
    campaign_objective: campaign.campaign_objective,
    campaign_type: campaign.campaign_type,
    campaign_brand_category: campaign.campaign_brand_category,
  };

  const creatives = campaign.creatives;
  const location = {
    cities: [],
    locationInclude: true,
  };

  if (campaign.location) {
    if (campaign.location.include && campaign.location.include.length > 0) {
      location.locationInclude = true;
      location.cities = campaign.location.include.cities;
      location.markers = campaign.location.markers;
    } else {
      location.locationInclude = false;
      if (campaign.location.exclude) {
        location.cities = campaign.location.exclude.cities;
        location.markers = campaign.location.markers;
      } else {
        location.cities = [];
        location.markers = [];
      }
    }
  }

  const budget = {
    currency: '',
    total: '',
    cpm: '',
  };

  const schedule = {
    startdate: new Date(campaign.startdate),
    enddate: new Date(campaign.enddate),
    starttime: new Date(campaign.starttime),
    endtime: new Date(campaign.endtime),
  };

  if (campaign.campaign_budget) {
    budget.total = campaign.campaign_budget.total;
    budget.currency = campaign.campaign_budget.currency;
    budget.cpm = campaign.campaign_budget.cpm;
  }

  const fequencyCapUser = {
    total_views: '',
    daily_views: '',
  };
  const fequencyCapSession = {
    total_views: '',
  };
  if (campaign.frequency_cap) {
    if (campaign.frequency_cap.user) {
      fequencyCapUser.total_views = campaign.frequency_cap.user.total_views;
      fequencyCapUser.daily_views = campaign.frequency_cap.user.daily_views;
    }

    if (campaign.frequency_cap.session) {
      fequencyCapSession.total_views = campaign.frequency_cap.session.total_views;
    }
  }

  return { objective, creatives, target, location,
      budget, schedule, fequencyCapUser, fequencyCapSession };
}

export function newCampaign(userId) {
  const campaign = {
    _id: '', campaign_running_status: 'Pending',
    created_userid: userId,
  };

  const creatives = {};

  const budget = { currency: '', total: '', cpm: '' };

  // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
  const target = { gender: 'all', income_group: [], tags: [], agegroup: [],
   interests: ['Travel'], websites: [] };

  const fequencyCapUser = { total_views: '', daily_views: '' };
  const fequencyCapSession = { total_views: '' };

  const location = { cities: [], locationInclude: [], markers: [] };

  const schedule = { startdate: '', enddate: '', starttime: '', endtime: '' };

  const objective = { campaign_name: '', campaign_objective: '',
  campaign_type: 'Web', campaign_brand_category: '' };

  return {
    type: NEW_CAMPAIGN_START,
    payload: { campaign, objective, schedule, target,
      creatives, budget, fequencyCapUser, fequencyCapSession,
      location },
  };
}

export function copyFromCampaign(campaignId) {
  return async (dispatch) => {
    const url = `/api/campaign/get/${campaignId}`;
    const obj = {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Credentials': true,
        crossDomain: true,
      },
      credentials: 'include',
    };
    const response = await fetch(url, obj);
    const data = await response.json();
    const _campaign = data.result;
    const campaign = {};
    campaign.campaign_running_status = _campaign.campaign_running_status;
    campaign.created_userid = _campaign.created_userid;
    dispatch({
      type: COPY_FROM_CAMPAIGN_START,
      payload: { ...populateFromCampaign(_campaign), campaign },
    });
  };
}

export function editCampaign(campaign) {
  const _campaign = {
    _id: campaign._id,
    created_userid: campaign.created_userid,
    campaign_running_status: campaign.campaign_running_status,
  };

  return {
    type: EDIT_CAMPAIGN_START,
    payload: { ...populateFromCampaign(campaign), campaign: _campaign },
  };
}

export function objectiveFieldChanged(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: OBJECTIVE_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function targetFieldSimpleChange(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: TARGET_SIMPLE_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function targetFieldArrayChange(fieldName, fieldValue, isAddOperation) {
  return async (dispatch) => {
    dispatch({
      type: TARGET_ARRAY_FIELD_UPDATED,
      payload: { fieldName, fieldValue, isAddOperation },
    });

    // Check and update Target Reach Here
  };
}

export function locationFieldSimpleChange(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: LOCATION_SIMPLE_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function locationFieldArrayChange(fieldName, fieldValue, isAddOperation) {
  return async (dispatch) => {
    dispatch({
      type: LOCATION_ARRAY_FIELD_UPDATED,
      payload: { fieldName, fieldValue, isAddOperation },
    });

    // Check and update Target Reach Here
  };
}

export function budgetChange(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: BUDGET_SIMPLE_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function scheduleChange(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: SCHEDULE_SIMPLE_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function frequnceyCapUserChange(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: FREQUENCYCAP_USER_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function frequencyCapSessionChange(fieldName, fieldValue) {
  return async (dispatch) => {
    dispatch({
      type: FREQUENCYCAP_SESSION_FIELD_UPDATED,
      payload: { [fieldName]: fieldValue },
    });

    // Check and update Target Reach Here
  };
}

export function removeCreative(data) {
  return {
    type: REMOVE_CREATIVE,
    payload: data,
  };
}

export function addCreatives(id, data) {
  return {
    type: ADD_CREATIVES,
    payload: data,
  };
}

export function addMarker(data) {
  return {
    type: ADD_MARKER,
    payload: data,
  };
}

export function removeMarker(data) {
  return {
    type: REMOVE_MARKER,
    payload: data,
  };
}

export function saveCampaign(isEditingCampaign, campaign, objective,
    creatives, target, location, budget, schedule, fequencyCapUser, fequencyCapSession,
  ) {
  return async (dispatch) => {
    dispatch({
      type: SAVE_CAMPAIGN_START,
      payload: {
        ...objective,
        creatives: { ...creatives },
        campaignShouldRedirect: false,
        showSavingInProgress: true,
      },
    });

    try {
      const creativeIds = creatives.map(({ _id }) => _id);
      const campaignToPost = {
        ...objective,
        creatives: creativeIds,
        campaign_budget: { ...budget },
        ...schedule,
        frequency_cap: { user: { ...fequencyCapUser }, session: { ...fequencyCapSession } },
        performance: { impression: 0, cpc: 0, ctr: 0, click: 0 },
      };

      const { gender, agegroup, income_group,
        tags, interests, websites,
        tagsInclude, interestsInclude, webSitesInclude } = target;
      const targetObj = { include: { gender, agegroup, income_group }, exclude: {} };
      if (tagsInclude) {
        targetObj.include = { ...targetObj.include, tags };
      } else {
        targetObj.exclude = { ...targetObj.exclude, tags };
      }

      if (interestsInclude) {
        targetObj.include = { ...targetObj.include, interests };
      } else {
        targetObj.exclude = { ...targetObj.exclude, interests };
      }

      if (webSitesInclude) {
        targetObj.include = { ...targetObj.include, websites };
      } else {
        targetObj.exclude = { ...targetObj.exclude, websites };
      }

      campaignToPost.target = targetObj;

      const { cities, locationInclude, markers } = location;
      if (locationInclude) {
        campaignToPost.location = { include: { cities }, markers };
      } else {
        campaignToPost.location = { exclude: { cities }, markers };
      }

      campaignToPost.target = targetObj;

      campaignToPost.created_userid = campaign.created_userid;
      campaignToPost.campaign_running_status = campaign.campaign_running_status;

      const postData = { key: campaignToPost };
      if (isEditingCampaign) {
        postData.campaignid = campaign._id;
      }

      const obj = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          crossDomain: true,
        },
        credentials: 'include',
        body: JSON.stringify(postData),
      };

      const url = '/api/campaign';
      const response = await fetch(url, obj);

      if (response.status === 200) {
        const data = await response.json();
        if (data.status === 'OK') {
          dispatch({
            type: SAVE_CAMPAIGN_SUCCESS,
            payload: {
              message: data.message,
            },
          });
        } else {
          dispatch({
            type: SAVE_CAMPAIGN_FAILED,
            payload: {
              error: data.message,
            },
          });
        }
      } else {
        throw new Error(response.status);
      }
    } catch (error) {
      dispatch({
        type: SAVE_CAMPAIGN_FAILED,
        payload: {
          status,
          error,
        },
      });
      return false;
    }

    return true;
  };
}

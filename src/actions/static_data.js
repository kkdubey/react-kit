import {
  FETCH_STATIC_DATA_START,
  FETCH_STATIC_DATA_SUCCESS,
  FETCH_STATIC_DATA_FAILED,
  FETCH_TARGET_REACH_START,
  FETCH_TARGET_REACH_SUCCESS,
  FETCH_TARGET_REACH_FAILED,
} from '../constants';

export function fetchStaticData() {
  return async (dispatch) => {
    dispatch({
      type: FETCH_STATIC_DATA_START,
    });

    try {
      const obj = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Access-Control-Allow-Credentials': true,
          crossDomain: true,
        },
        credentials: 'include',
      };

      const responses = await Promise.all([
        (await fetch('/api/static/?key=brand_category', obj)).json(),
        (await fetch('/api/static/?key=age_group', obj)).json(),
        (await fetch('/api/static/?key=income_group', obj)).json(),
      ]);

      dispatch({
        type: FETCH_STATIC_DATA_SUCCESS,
        payload: {
          responses,
        },
      });
    } catch (error) {
      dispatch({
        type: FETCH_STATIC_DATA_FAILED,
        payload: {
          error,
        },
      });
      return false;
    }

    return true;
  };
}

export function fetchTargetReach(reachFrom) {
  return async (dispatch) => {
    dispatch({
      type: FETCH_TARGET_REACH_START,
      payload: {
        reachFrom,
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
      };
      const response = await fetch('/api/reach', obj);
      const data = await response.json();

      if (data.status === 'OK') {
        dispatch({
          type: FETCH_TARGET_REACH_SUCCESS,
          payload: {
            reachFrom,
            reachTo: data.reach,
          },
        });
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      dispatch({
        type: FETCH_TARGET_REACH_FAILED,
        payload: {
          reachFrom,
          error,
        },
      });
      return false;
    }

    return true;
  };
}

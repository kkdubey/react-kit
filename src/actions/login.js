import {
  USER_LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
} from '../constants';

export function login(email, password) {
  return async (dispatch) => {
    dispatch({
      type: USER_LOGIN_START,
      payload: {
        email,
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
        body: JSON.stringify({
          email,
          password,
        }),
        credentials: 'include',
      };

      const response = await fetch('/api/user/login', obj);

      if (response.status === 200) {
        const user = await response.json();
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            email,
            user,
          },
        });
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      dispatch({
        type: LOGIN_FAILED,
        payload: {
          email,
          error,
        },
      });
      return false;
    }

    return true;
  };
}

export function setLoginSuccess({ email, user }) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      email,
      user,
    },
  };
}


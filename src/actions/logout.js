import { USER_LOG_OUT } from '../constants';

export function logout(email) {
  return {
    type: USER_LOG_OUT,
    payload: { email },
  };
}

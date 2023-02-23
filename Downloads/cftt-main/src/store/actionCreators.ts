import * as actionTypes from "./actionTypes"

export function addUser(userObject: LoggedInUserObject) {
  const action: AuthAction = {
    type: actionTypes.LOGIN_SUCCESSFUL,
    userObject,
  }
  return action;

};

export function removeUser(userObject: LoggedInUserObject) {
  const action: AuthAction = {
    type: actionTypes.LOGOUT_SUCCESSFUL,
    userObject:{},
  }
  return action;

};


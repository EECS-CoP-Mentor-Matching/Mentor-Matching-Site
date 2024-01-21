// Actions for profile management:

import { Action } from "redux";
import { UserProfile } from "../../types";
import { Dispatch } from "redux"
import { ThunkDispatch } from 'redux-thunk';
import userService from "../../service/userService";

export interface UserProfileAction extends Action {
  payload: UserProfile
}

// profileActions.js
export const setUserProfile = (userProfile: UserProfile) : UserProfileAction => {
    return {
      type: 'SET_USER_PROFILE',
      payload: userProfile,
    } as UserProfileAction;
  };

  export const updateUserProfileAction = (uid: string, userProfile: UserProfile) => 
  async (dispatch: ThunkDispatch<any, any, Action>) => {
    await userService.updateUserProfile(uid, userProfile);
    dispatch(setUserProfile(userProfile));
  };
  
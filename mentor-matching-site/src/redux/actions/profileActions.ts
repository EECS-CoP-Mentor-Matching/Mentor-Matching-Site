// Actions for profile management:

import { Action } from "redux";
import { UserProfile } from "../../types";

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
  
// This reducer will handle the user profile state:

import { UserProfileAction } from "../profileActions";

const initialState = {
    userProfile: null,
  };
  
  const profileReducer = (state = initialState, action: UserProfileAction) => {
    switch (action.type) {
      case 'SET_USER_PROFILE':
        return {
          ...state,
          userProfile: action,
        };
      // handle other actions if necessary
      default:
        return state;
    }
  };
  
  export default profileReducer;
  

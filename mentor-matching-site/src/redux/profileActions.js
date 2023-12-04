// Actions for profile management:

// profileActions.js
export const setUserProfile = (userProfile) => {
    return {
      type: 'SET_USER_PROFILE',
      payload: userProfile,
    };
  };
  
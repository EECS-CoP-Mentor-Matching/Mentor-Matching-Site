// This reducer will handle the user profile state:


const initialState = {
    userProfile: null,
  };
  
  const profileReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_USER_PROFILE':
        return {
          ...state,
          userProfile: action.payload,
        };
      // handle other actions if necessary
      default:
        return state;
    }
  };
  
  export default profileReducer;
  

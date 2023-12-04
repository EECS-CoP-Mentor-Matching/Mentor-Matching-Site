// This reducer will handle authentication-related state:


const initialState = {
    isAuthenticated: false,
    user: null,
    // Add other auth states if needed
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_USER':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload
            };
        // Add other cases for different auth actions
        default:
            return state;
    }
};

export default authReducer;

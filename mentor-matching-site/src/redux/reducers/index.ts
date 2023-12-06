import { combineReducers } from 'redux';
import profileReducer from './profileReducer';
const rootReducer = combineReducers({
    profile: profileReducer,
    // Other reducers...
});

export default rootReducer;
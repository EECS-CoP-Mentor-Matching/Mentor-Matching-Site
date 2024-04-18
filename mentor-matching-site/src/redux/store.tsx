import { configureStore } from '@reduxjs/toolkit'
import userProfileReducer from './reducers/userProfileReducer';
import { Provider } from 'react-redux';
import { ReactElement } from 'react';
import matchProfileReducer from './reducers/matchProfileReducer';

const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    matchProfiles: matchProfileReducer
  },
});

interface ReduxProviderProps {
  children: ReactElement[] | ReactElement | any
}

const ReduxProvider = ({ children }: ReduxProviderProps) => {
  return (
    <Provider store={store}>{children}</Provider>
  );
}

export default ReduxProvider;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
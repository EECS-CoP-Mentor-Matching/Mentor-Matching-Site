// This reducer will handle the user profile state:
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserProfile } from "../../types";
import { RootState } from "../store";

const initialState = {
  userProfile: {} as UserProfile,
} as UserProfileState;

export interface UserProfileState {
  userProfile: UserProfile
}

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile: (state = initialState, action: PayloadAction<UserProfile>) => {
      state.userProfile = action.payload;
    }
  }
});

export const { updateProfile } = profileSlice.actions

export const selectProfile = (state: RootState) => state.profile

export default profileSlice.reducer
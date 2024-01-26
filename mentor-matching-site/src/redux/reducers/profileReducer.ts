// This reducer will handle the user profile state:
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserProfile, UserPersonalInformation } from "../../types";
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
    updateProfile: (state = initialState, action: PayloadAction<UserProfile>) => { state.userProfile = action.payload; },
    // update personal information
    updatePersonalInformation: (state, action: PayloadAction<UserPersonalInformation>) => { state.userProfile.personal = action.payload; },
    updateFirstName: (state, action: PayloadAction<string>) => { state.userProfile.personal.firstName = action.payload; },
    updateLastName: (state, action: PayloadAction<string>) => { state.userProfile.personal.lastName = action.payload; },
    updateMiddleName: (state, action: PayloadAction<string>) => { state.userProfile.personal.middleName = action.payload; },
    updateDob: (state, action: PayloadAction<string>) => { state.userProfile.personal.dob = action.payload; },
    // update demographic information
    // updaate contact information
    // update education information
    // update account settings
  }
});

export const {
  updateProfile,
  // update personal information
  updatePersonalInformation, updateFirstName, updateLastName, updateMiddleName, updateDob
  // update demographics
  // 
} = profileSlice.actions

export const selectProfile = (state: RootState) => state.profile
export const selectPersonalInformation = (state: RootState) => state.profile.userProfile.personal

export default profileSlice.reducer
// This reducer will handle the user profile state:
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserPersonalInformation, UserProfile, UserContactInformation } from "../../types/userProfile";
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
    // update contact information
    updateContactInformation: (state, action: PayloadAction<UserContactInformation>) => { state.userProfile.contact = action.payload; },
    updateDisplayName: (state, action: PayloadAction<string>) => { state.userProfile.contact.displayName = action.payload; },
    updateEmail: (state, action: PayloadAction<string>) => { state.userProfile.contact.email = action.payload; },
    updateTimeZone: (state, action: PayloadAction<string>) => { state.userProfile.contact.timeZone = action.payload; },
    updatePronouns: (state, action: PayloadAction<string>) => { state.userProfile.contact.pronouns = action.payload; },
    updateUserBio: (state, action: PayloadAction<string>) => { state.userProfile.contact.userBio = action.payload; },
    // update education information
    // update account settings
  }
});

export const {
  updateProfile,
  // update personal information
  updatePersonalInformation, updateFirstName, updateLastName, updateMiddleName, updateDob,
  // update demographics
  // update contact information
  updateContactInformation, updateDisplayName, updateEmail, updateTimeZone, updatePronouns, updateUserBio
} = profileSlice.actions

export const selectProfile = (state: RootState) => state.profile
export const selectPersonalInformation = (state: RootState) => state.profile.userProfile.personal

export default profileSlice.reducer
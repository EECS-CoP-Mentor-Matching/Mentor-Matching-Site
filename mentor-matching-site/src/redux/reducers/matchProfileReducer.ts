// This reducer will handle the user profile state:
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { MatchProfile, MatchProfiles, initMatchProfile, initMatchProfiles } from "../../types/matchProfile";

const initialState = {
  matchProfiles: initMatchProfiles(),
  newMenteeProfile: initMatchProfile(),
  newMentorProfile: initMatchProfile()
}

export interface MatchProfilesState {
  matchProfiles: MatchProfiles,
  newMenteeProfile: MatchProfile,
  newMentorProfile: MatchProfile
}

export const matchProfilesSlice = createSlice({
  name: 'matchProfiles',
  initialState,
  reducers: {
    // current match profiles
    updateMatchProfiles: (state = initialState, action: PayloadAction<MatchProfiles>) => { state.matchProfiles = action.payload; },
    // new mentee profile
    updateNewMenteeProfile: (state = initialState, action: PayloadAction<MatchProfile>) => { state.newMenteeProfile = action.payload; },
    updateNewMenteeProfileProfessionalInterest: (state = initialState, action: PayloadAction<string>) => { state.newMenteeProfile.professionalInterest = action.payload; },
    updateNewMenteeProfileTechnicalInterest: (state = initialState, action: PayloadAction<string>) => { state.newMenteeProfile.technicalInterest = action.payload; },
    // new mentor profile
    updateNewMentorProfile: (state = initialState, action: PayloadAction<MatchProfile>) => { state.newMentorProfile = action.payload; },
  }
});

export const {
  // current match profiles
  updateMatchProfiles,
  // new mentee profile
  updateNewMenteeProfile, updateNewMenteeProfileProfessionalInterest, updateNewMenteeProfileTechnicalInterest,
  // new mentor profile
  updateNewMentorProfile
} = matchProfilesSlice.actions

export const selectMatchPofiles = (state: RootState) => state.matchProfiles

export default matchProfilesSlice.reducer
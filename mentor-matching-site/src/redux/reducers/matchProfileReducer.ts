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
    updateMatchProfiles: (state = initialState, action: PayloadAction<MatchProfiles>) => { state.matchProfiles = action.payload; },
    updateNewMenteeProfile: (state = initialState, action: PayloadAction<MatchProfile>) => { state.newMenteeProfile = action.payload; },
    updateNewMentorProfile: (state = initialState, action: PayloadAction<MatchProfile>) => { state.newMentorProfile = action.payload; },
  }
});

export const {
  updateMatchProfiles
} = matchProfilesSlice.actions

export const selectMatchPofiles = (state: RootState) => state.matchProfiles

export default matchProfilesSlice.reducer
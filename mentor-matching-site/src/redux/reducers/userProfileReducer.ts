// This reducer will handle the user profile state:
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserPreferences, UserPersonalInformation, UserProfile, UserRole, UserContactInformation, initUserProfile, UserAccountSettings, UserAvailability} from "../../types/userProfile";
import { RootState } from "../store";

const initialState = {
  userProfile: initUserProfile()
}

export interface UserProfileState {
  userProfile: UserProfile
}

export const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    updateProfile: (state = initialState, action: PayloadAction<UserProfile>) => { state.userProfile = action.payload; },
    updateUID: (state = initialState, action: PayloadAction<string>) => { state.userProfile.UID = action.payload; },
    // update personal information
    updatePersonalInformation: (state, action: PayloadAction<UserPersonalInformation>) => { state.userProfile.personal = action.payload; },
    updateFirstName: (state, action: PayloadAction<string>) => { state.userProfile.personal.firstName = action.payload; },
    updateLastName: (state, action: PayloadAction<string>) => { state.userProfile.personal.lastName = action.payload; },
    updateMiddleName: (state, action: PayloadAction<string>) => { state.userProfile.personal.middleName = action.payload; },
    // update availability
    updateHoursPerWeek: (state, action: PayloadAction<string>) => { state.userProfile.availability.hoursPerWeek = action.payload; },
    // update contact information
    updateContactInformation: (state, action: PayloadAction<UserContactInformation>) => { state.userProfile.contact = action.payload; },
    updateDisplayName: (state, action: PayloadAction<string>) => { state.userProfile.contact.displayName = action.payload; },
    updateEmail: (state, action: PayloadAction<string>) => { state.userProfile.contact.email = action.payload; },
    updateTimeZone: (state, action: PayloadAction<string>) => { state.userProfile.contact.timeZone = action.payload; },
    updatePronouns: (state, action: PayloadAction<string>) => { state.userProfile.contact.pronouns = action.payload; },
    updateUserBio: (state, action: PayloadAction<string>) => { state.userProfile.contact.userBio = action.payload; },

    // update account settings
    updateAccountSettings: (state, action: PayloadAction<UserAccountSettings>) => { state.userProfile.accountSettings = action.payload; },
    updateUserStatus: (state, action: PayloadAction<string>) => { state.userProfile.accountSettings.userStatus = action.payload; },
    updateMenteePortalEnabled: (state, action: PayloadAction<boolean>) => { state.userProfile.accountSettings.menteePortalEnabled = action.payload; },
    updateMentorPortalEnabled: (state, action: PayloadAction<boolean>) => { state.userProfile.accountSettings.mentorPortalEnabled = action.payload; },
    // user preferences 
    updateUserPreferences: (state, action: PayloadAction<UserPreferences>) => { state.userProfile.preferences = action.payload; },
    updateRole: (state, action: PayloadAction<UserRole>) => { state.userProfile.preferences.role = action.payload; },
    // profile image
    updateUserProfileImage: (state, action: PayloadAction<string>) => { state.userProfile.imageUrl = action.payload; }
  }
});

export const {
  updateProfile, updateUID,
  // update personal information
  updatePersonalInformation, updateFirstName, updateLastName, updateMiddleName,
  // update contact information
  updateContactInformation, updateDisplayName, updateRole, updateEmail, updateTimeZone, updatePronouns, updateUserBio,
  // update availability
  updateHoursPerWeek,
  // update account settings
  updateAccountSettings, updateUserStatus, updateMenteePortalEnabled, updateMentorPortalEnabled,
  // user preferences
  updateUserPreferences,
  // profile image
  updateUserProfileImage
} = userProfileSlice.actions

export const selectUserProfile = (state: RootState) => state.userProfile

export default userProfileSlice.reducer
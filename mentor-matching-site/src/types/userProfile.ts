export interface UserProfileProps {
  userProfile: UserProfile;
}

export type UserRole = "Mentee" | "Mentor" | "Both" | "Admin" | "none";

export interface UserProfile {
  UID: string
  contact: UserContactInformation
  personal: UserPersonalInformation
  availability: UserAvailability  // NEW
  accountSettings: UserAccountSettings
  matchHistory: MatchHistoryItem[]
  profilePictureUrl: string | undefined;
  preferences: UserPreferences;
  imageUrl?: string; // Make imageUrl optional
}

export const initUserProfile = () => {
  return {
    UID: "",
    contact: initUserContactInformation(),
    personal: initUserPersonalInformation(),
    availability: initUserAvailability(),  // NEW
    accountSettings: initUserAccountSettings(),
    matchHistory: Array<MatchHistoryItem>(),
    profilePictureUrl: "",
    preferences: initUserPreferences()
  } as UserProfile
}

export interface UserPreferences {
  role: UserRole
}

export const initUserPreferences = () => {
  return {
    role: "none"
  } as UserPreferences
}

export interface UserContactInformation {
  email: string
  timeZone: string
  displayName: string
  pronouns: string
  userBio: string
}

export const initUserContactInformation = () => {
  return {
    email: "",
    timeZone: "",
    displayName: "",
    pronouns: "",
    userBio: ""
  } as UserContactInformation
}

export interface UserPersonalInformation {
  firstName: string
  lastName: string
  middleName: string
}

export const initUserPersonalInformation = () => {
  return {
    firstName: "",
    lastName: "",
    middleName: ""
  } as UserPersonalInformation
}

// NEW: Availability Information
export interface UserAvailability {
  hoursPerWeek: string
}

export const initUserAvailability = () => {
  return {
    hoursPerWeek: ""
  } as UserAvailability
}

// Hours per week options for dropdown
export const HOURS_PER_WEEK_OPTIONS = [
  "1-2 hours per week",
  "3-5 hours per week",
  "6-10 hours per week",
  "10+ hours per week"
];

export interface UserAccountSettings {
  userStatus: string
  menteePortalEnabled: boolean
  mentorPortalEnabled: boolean
}

export const initUserAccountSettings = () => {
  return {
    userStatus: "",
    menteePortalEnabled: false,
    mentorPortalEnabled: false
  } as UserAccountSettings
}

export interface MatchHistoryItem {
  menteeProfileID: string
  mentorProfileID: string
  matchDateTime: Date
  matchStatus: boolean
}

export interface UserStatus {
  name: string
}

export interface TimeZone {
  id: number
  timeZoneName: string
  utcOffset: number
}

// Keep these type definitions for database queries
// (Not used in UserProfile interface, but needed for selection dropdowns)
export interface RacialIdentity {
  id: number
  identityName: string
}

export interface DegreeProgram {
  id: number
  degreeProgramName: string
}

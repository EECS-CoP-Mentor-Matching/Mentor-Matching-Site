
export interface UserProfile {
  displayName: string
  UID: string
  contact: UserContactInformation
  personal: UserPersonalInformation
  demographics: UserDemographicInformation
  education: UserEducationInformation
  accountSettings: UserAccountSettings
  matchHistory: MatchHistoryItem[]
  profilePictureUrl: string | undefined;
  preferences: UserPreferences;
}

export const initUserProfile = () => {
  return {
    displayName: "",
    UID: "",
    contact: initUserContactInformation(),
    personal: initUserPersonalInformation(),
    demographics: initUserDemographicInformation(),
    education: initUserEducationInformation(),
    accountSettings: initUserAccountSettings(),
    matchHistory: Array<MatchHistoryItem>(),
    profilePictureUrl: "",
    preferences: initUserPreferences()
  } as UserProfile
}

export interface UserPreferences {

}

export const initUserPreferences = () => {
  return {} as UserPreferences
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
  dob: string
}

export const initUserPersonalInformation = () => {
  return {
    firstName: "",
    lastName: "",
    middleName: "",
    dob: ""
  } as UserPersonalInformation
}

export interface UserDemographicInformation {
  racialIdentity: string
  lgbtqPlusCommunity: boolean
}

export const initUserDemographicInformation = () => {
  return {
    racialIdentity: "",
    lgbtqPlusCommunity: false
  } as UserDemographicInformation
}

export interface UserEducationInformation {
  highestLevelOfEducation: string
  degreeProgram: string
  studentStatus: boolean
}

export const initUserEducationInformation = () => {
  return {
    highestLevelOfEducation: "",
    degreeProgram: "",
    studentStatus: false
  } as UserEducationInformation
}

export interface UserAccountSettings {
  userStatus: string
  menteeProfilesEnabled: boolean
  mentorProfileEnabled: boolean
  useDemographicsForMatching: boolean
}

export const initUserAccountSettings = () => {
  return {
    userStatus: "",
    menteeProfilesEnabled: false,
    mentorProfileEnabled: false,
    useDemographicsForMatching: false
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
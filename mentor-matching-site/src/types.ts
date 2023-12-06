export interface MatchProfile {
  technicalInterest: string
  technicalExperience: string
  professionalInterest: string
  professionalExperience: string
}

export interface UserProfile {
  UID: string
  contact: UserContactInformation
  personal: UserPersonalInformation
  demographics: UserDemographicInformation
  education: UserEducationInformation
  accountSettings: UserAccountSettings
  matchHistory: MatchHistoryItem[]
  profilePictureUrl: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  // Define preferences structure
}

export interface UserContactInformation {
  email: string
  timeZone: string
  displayName: string
  pronouns: string
  userBio: string
}

export interface UserPersonalInformation {
  firstName: string
  lastName: string
  middleName: string
  dob: number
}

export interface UserDemographicInformation {
  racialIdentity: string
  lgbtqPlusCommunity: boolean
}

export interface UserEducationInformation {
  highestLevelOfEducation: string
  degreeProgram: string
  studentStatus: boolean
}

export interface UserAccountSettings {
  userStatus: string
  menteeProfilesEnabled: boolean
  mentorProfileEnabled: boolean
  useDemographicsForMatching: boolean
}

export interface MatchHistoryItem {
  menteeProfileID: string
  mentorProfileID: string
  matchDateTime: Date
  matchStatus: boolean
}

export interface EmailDenyList {
  email: string
  UID: string
}

export interface ExperienceLevel {
  experienceLevelID: string
  experienceLevel: string
  minYear: number
  maxYear: number
}

export interface EducationLevel {
  educationLevelID: string
  levelHeirarchy: number
  educationLevel: string
}

export interface UserStatus {
  userStatusID: string
  name: string
}

export interface TimeZone {
  timeZoneID: string
  timeZone: string
}

export interface TechincalInterest {
  technicalInterestID: string
  technicalInterest: string
  enabled: boolean
}

export interface ProfessionalInterest {
  professionaInterestID: string
  professionaInterest: string
  enabled: boolean
}

export interface InterestExperienceLevel {
  interestExperienceLevelID: string
  interestExperienceLevel: string
}


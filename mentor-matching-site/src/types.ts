export interface MatchProfile {
  technicalInterest: string
  technicalExperience: number
  professionalInterest: string
  professionalExperience: number
}

export interface UserProfile {
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
  experienceLevel: string
  levelHeirarchy: number
}

export interface EducationLevel {
  educationLevel: string
  levelHeirarchy: number
}

export interface UserStatus {
  name: string
}

export interface TimeZone {
  timeZone: string
}

export interface TechincalInterest {
  broadInterest: string
  specificInterests: string[]
}

export interface ProfessionalInterest {
  professionaInterest: string
}

export interface DropDownOption {
  label: string,
  id: number
}
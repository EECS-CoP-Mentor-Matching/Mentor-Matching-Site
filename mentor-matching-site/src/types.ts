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


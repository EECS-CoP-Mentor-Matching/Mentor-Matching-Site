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
  consent: UserConsentInformation
  status: UserStatusInformation
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
}

export interface UserDemographicInformation {
  racialIdentity: string
  lgbtqPlusCommunity: boolean
  highestLevelOfEducation: string
  degreeProgram: string
}

export interface UserConsentInformation {
  studentStatus: boolean
  consent: boolean
}

export interface UserStatusInformation {
  userStatus: string
  menteeProfilesEnabled: boolean
  mentorProfileEnabled: boolean
}


export enum MatchProfileType {
  Mentee,
  Mentor
}

export interface MatchProfiles {
  UID: string
  menteeProfiles: MatchProfile[]
  mentorProfiles: MatchProfile[]
}

export const initMatchProfiles = () => {
  return {
    UID: '',
    menteeProfiles: Array<MatchProfile>(),
    mentorProfiles: Array<MatchProfile>()
  } as MatchProfiles
}

export interface MatchProfile {
  UID: string
  technicalInterest: string
  technicalExperience: number
  professionalInterest: string
  professionalExperience: number
}

export const initMatchProfile = () => {
  return {
    UID: "",
    technicalInterest: "",
    technicalExperience: -1,
    professionalInterest: "",
    professionalExperience: -1
  } as MatchProfile
}

export interface EmailDenyList {
  email: string
  UID: string
}

export interface ExperienceLevel {
  level: string
  hierarchy: number
}

export interface EducationLevel {
  level: string
  hierarchy: number
}

export interface TechnicalInterest {
  broadInterest: string
  specificInterests: string[]
}

export interface ProfessionalInterest {
  professionalInterest: string
}
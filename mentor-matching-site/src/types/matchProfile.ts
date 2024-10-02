import { DocItem } from "./types"

export enum MatchRole {
  mentee = "Mentee",
  mentor = "Mentor",
  both = "Both"
}

export interface Message {
  menteeUID: string
  menteeProfileId: string
  mentorUID: string
  mentorProfileId: string
  message: string
  mentorReply: string
  technicalInterest: string
  professionalInterest: string
  sentByUID: string
  sentOn: any
}

export enum MessageState {
  noMessagesSent,
  awaitingReply,
  replyReceived
}

export enum MentorReply {
  awaiting,
  accepted,
  denied
}

export enum ReportUserReasons {
  notSelected = "NA",
  suspiciousActivity = "Suspicious Activity",
  abusiveContent = "Abusive Content",
  iFeelUncomforatble = "I Feel Uncomfortable",
  iFeelUnsafe = "I Feel Unsafe"
}

export interface MatchProfileView {
  mentorProfile: DocItem<MatchProfile>
  messageState: MessageState
}

export interface MatchProfiles {
  UID: string
  menteeProfiles: MatchProfileWithId[]
  mentorProfiles: MatchProfileWithId[]
}

export const initMatchProfiles = () => {
  return {
    UID: '',
    menteeProfiles: Array<MatchProfileWithId>(),
    mentorProfiles: Array<MatchProfileWithId>()
  } as MatchProfiles
}

export interface MatchProfileWithId {
  matchProfileId: string,
  matchProfile: MatchProfile
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
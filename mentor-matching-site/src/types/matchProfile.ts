import { DocItem } from "./types"

export enum MatchRole {
  mentee = "Mentee",
  mentor = "Mentor",
  admin = "Admin",
  both = "Both"
}

// ============================================
// NEW: User Weights for Matching Algorithm
// ============================================
export interface UserWeights {
  technicalInterests: number; // 1-5 scale
  lifeExperiences: number; // 1-5 scale
  languages: number; // 1-5 scale
}

export const initUserWeights = (): UserWeights => {
  return {
    technicalInterests: 3,
    lifeExperiences: 3,
    languages: 3
  }
}

// ============================================
// UPDATED: Match Profile with New Fields
// ============================================
export interface MatchProfile {
  UID: string
  
  // Legacy fields (keep for backward compatibility)
  technicalInterest: string
  technicalExperience: number
  professionalInterest: string
  professionalExperience: number
  
  // NEW: Extended matching fields
  careerFields?: string[] // Q1: Career fields (AI, CS, Cybersecurity, etc.)
  technicalInterests?: string[] // Q2: Specific technical interests (dynamically populated)
  lifeExperiences?: string[] // Q3: Life experiences (Parent, LGBTQ+, etc.)
  languages?: string[] // Q4: Languages
  otherLanguage?: string // If "Other" selected in languages
  
  // NEW: User-defined weights (1-5 scale)
  weights?: UserWeights
  
  // NEW: Public profile fields
  introduction?: string // Short profile name (50 chars)
  aboutMe?: string // Longer introduction for vetting (200-500 chars)
  mentorshipGoal?: string // What they want to work on
  mentorshipGoalOther?: string // If "Other" selected
  areasOfExpertise?: string[] // For mentors only
  
  // NEW: Matching availability
  isActive?: boolean // Available for matching
  maxMatches?: number // For mentors: capacity limit
  currentMatchCount?: number
  
  // Timestamps
  createdAt?: any // Firestore Timestamp
  updatedAt?: any // Firestore Timestamp
}

export const initMatchProfile = (): MatchProfile => {
  return {
    UID: "",
    technicalInterest: "",
    technicalExperience: -1,
    professionalInterest: "",
    professionalExperience: -1,
    careerFields: [],
    technicalInterests: [],
    lifeExperiences: [],
    languages: ['English'], // Default to English
    weights: initUserWeights(),
    introduction: "",
    mentorshipGoal: "",
    isActive: true,
    currentMatchCount: 0
  } as MatchProfile
}

// ============================================
// NEW: Match Record (stored in "matches" collection)
// ============================================
export interface Match {
  matchId?: string // Document ID
  
  // User IDs
  menteeId: string
  mentorId: string
  menteeProfileId: string // Reference to specific mentee profile
  mentorProfileId: string // Reference to specific mentor profile
  
  // Match metadata
  matchedAt: any // Firestore Timestamp
  matchPercentage: number // Calculated match score (0-100)
  
  // Match details (snapshot at time of matching)
  matchDetails: {
    technicalInterestsScore: number
    lifeExperiencesScore: number
    languagesScore: number
    menteeWeights: UserWeights
    mentorWeights: UserWeights
  }
  
  // Status
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined'
  
  // Who initiated the match
  initiatedBy: 'mentee' | 'mentor' | 'system'
  
  // Timestamps for status changes
  acceptedAt?: any
  completedAt?: any
  declinedAt?: any
  
  // Optional notes
  notes?: string
}

export const initMatch = (): Match => {
  return {
    menteeId: '',
    mentorId: '',
    menteeProfileId: '',
    mentorProfileId: '',
    matchedAt: null,
    matchPercentage: 0,
    matchDetails: {
      technicalInterestsScore: 0,
      lifeExperiencesScore: 0,
      languagesScore: 0,
      menteeWeights: initUserWeights(),
      mentorWeights: initUserWeights()
    },
    status: 'pending',
    initiatedBy: 'mentee'
  }
}

// ============================================
// NEW: Calculated Match (temporary, not stored)
// ============================================
export interface CalculatedMatch {
  profileId: string // The match profile ID
  userId: string // The user's UID
  userType: 'mentor' | 'mentee'
  matchPercentage: number
  categoryScores: {
    technicalInterests: number
    lifeExperiences: number
    languages: number
  }
  profile: MatchProfile // Full profile data
}

// ============================================
// Existing Interfaces (unchanged)
// ============================================
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
/**
 * MATCHING SERVICE
 * 
 * Handles weighted matching algorithm and match management
 */

import { MatchProfile, UserWeights, CalculatedMatch, Match } from "../types/matchProfile";
import matchDb from "../dal/matchDb";

// ============================================
// Matching Algorithm
// ============================================

/**
 * Calculate similarity between two arrays using Jaccard similarity coefficient
 * Returns a value between 0 and 1
 */
function calculateArraySimilarity(arr1: string[], arr2: string[]): number {
  if (!arr1 || !arr2) return 0;
  if (arr1.length === 0 && arr2.length === 0) return 1; // Both empty = perfect match
  if (arr1.length === 0 || arr2.length === 0) return 0; // One empty = no match
  
  const set1 = new Set(arr1.map(item => item.toLowerCase().trim()));
  const set2 = new Set(arr2.map(item => item.toLowerCase().trim()));
  
  // Calculate intersection and union
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  
  return intersection.size / union.size;
}

/**
 * Calculate individual category score
 * Takes into account both users' weights and similarity
 */
function calculateCategoryScore(
  menteeValues: string[],
  mentorValues: string[],
  menteeWeight: number,
  mentorWeight: number
): number {
  // Calculate raw similarity (0-1)
  const similarity = calculateArraySimilarity(menteeValues, mentorValues);
  
  // Average the weights (both users' preferences matter)
  const avgWeight = (menteeWeight + mentorWeight) / 2;
  
  // Normalize weight to 0-1 scale (weights are 1-5)
  const normalizedWeight = avgWeight / 5;
  
  // Apply weight to similarity
  return similarity * normalizedWeight * 100; // Convert to percentage
}

/**
 * Calculate overall match percentage between mentee and mentor
 * 
 * @param menteeProfile - The mentee's profile
 * @param mentorProfile - The mentor's profile
 * @returns Match percentage (0-100) and individual category scores
 */
export function calculateMatchScore(
  menteeProfile: MatchProfile,
  mentorProfile: MatchProfile
): {
  matchPercentage: number;
  categoryScores: {
    technicalInterests: number;
    lifeExperiences: number;
    languages: number;
  };
} {
  // Get weights with defaults if not set
  const menteeWeights = menteeProfile.weights || {
    technicalInterests: 3,
    lifeExperiences: 3,
    languages: 3
  };
  
  const mentorWeights = mentorProfile.weights || {
    technicalInterests: 3,
    lifeExperiences: 3,
    languages: 3
  };
  
  // Calculate individual category scores
  // Combine career fields and technical interests into one score
  const careerFieldScore = calculateCategoryScore(
    menteeProfile.careerFields || [],
    mentorProfile.careerFields || [],
    1, // Equal weight for career fields within this category
    1
  );
  
  const technicalInterestScore = calculateCategoryScore(
    menteeProfile.technicalInterests || [],
    mentorProfile.technicalInterests || [],
    1, // Equal weight for technical interests within this category
    1
  );
  
  // Combine career & technical into one weighted score (50/50 split)
  const careerAndTechnicalScore = (careerFieldScore + technicalInterestScore) / 2;
  
  const lifeExpScore = calculateCategoryScore(
    menteeProfile.lifeExperiences || [],
    mentorProfile.lifeExperiences || [],
    menteeWeights.lifeExperiences,
    mentorWeights.lifeExperiences
  );
  
  const languagesScore = calculateCategoryScore(
    menteeProfile.languages || ['English'],
    mentorProfile.languages || ['English'],
    menteeWeights.languages,
    mentorWeights.languages
  );
  
  // Calculate weighted average
  // The weight contribution of each category is based on the average weight
  const avgCareerTechWeight = (menteeWeights.technicalInterests + mentorWeights.technicalInterests) / 2;
  const avgLifeWeight = (menteeWeights.lifeExperiences + mentorWeights.lifeExperiences) / 2;
  const avgLangWeight = (menteeWeights.languages + mentorWeights.languages) / 2;
  
  const totalWeight = avgCareerTechWeight + avgLifeWeight + avgLangWeight;
  
  // Calculate weighted percentage
  let matchPercentage = 0;
  if (totalWeight > 0) {
    matchPercentage = (
      (careerAndTechnicalScore * avgCareerTechWeight / totalWeight) +
      (lifeExpScore * avgLifeWeight / totalWeight) +
      (languagesScore * avgLangWeight / totalWeight)
    );
  }
  
  return {
    matchPercentage: Math.round(matchPercentage * 10) / 10, // Round to 1 decimal
    categoryScores: {
      technicalInterests: Math.round(careerAndTechnicalScore * 10) / 10, // Now includes both career fields and technical interests
      lifeExperiences: Math.round(lifeExpScore * 10) / 10,
      languages: Math.round(languagesScore * 10) / 10
    }
  };
}

/**
 * Find potential mentor matches for a mentee
 * Returns sorted list by match percentage (highest first)
 */
export async function findMentorMatches(
  menteeProfile: MatchProfile,
  mentorProfiles: MatchProfile[],
  minMatchPercentage: number = 0
): Promise<CalculatedMatch[]> {
  const matches: CalculatedMatch[] = [];
  
  for (const mentorProfile of mentorProfiles) {
    // Skip if mentor is not active or at capacity
    if (mentorProfile.isActive === false) continue;
    if (mentorProfile.maxMatches && 
        mentorProfile.currentMatchCount &&
        mentorProfile.currentMatchCount >= mentorProfile.maxMatches) {
      continue;
    }
    
    // Calculate match score
    const { matchPercentage, categoryScores } = calculateMatchScore(
      menteeProfile,
      mentorProfile
    );
    
    // Only include if meets minimum threshold
    if (matchPercentage >= minMatchPercentage) {
      matches.push({
        profileId: '', // Will be set by caller with actual profile ID
        userId: mentorProfile.UID,
        userType: 'mentor',
        matchPercentage,
        categoryScores,
        profile: mentorProfile
      });
    }
  }
  
  // Sort by match percentage (highest first)
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

/**
 * Find potential mentee matches for a mentor
 * Returns sorted list by match percentage (highest first)
 */
export async function findMenteeMatches(
  mentorProfile: MatchProfile,
  menteeProfiles: MatchProfile[],
  minMatchPercentage: number = 0
): Promise<CalculatedMatch[]> {
  const matches: CalculatedMatch[] = [];
  
  for (const menteeProfile of menteeProfiles) {
    // Skip if mentee is not active
    if (menteeProfile.isActive === false) continue;
    
    // Calculate match score
    const { matchPercentage, categoryScores } = calculateMatchScore(
      menteeProfile,
      mentorProfile
    );
    
    // Only include if meets minimum threshold
    if (matchPercentage >= minMatchPercentage) {
      matches.push({
        profileId: '', // Will be set by caller with actual profile ID
        userId: menteeProfile.UID,
        userType: 'mentee',
        matchPercentage,
        categoryScores,
        profile: menteeProfile
      });
    }
  }
  
  // Sort by match percentage (highest first)
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// ============================================
// Match Management
// ============================================

/**
 * Create a new match between mentee and mentor
 */
export async function createMatch(
  menteeProfile: MatchProfile,
  mentorProfile: MatchProfile,
  menteeProfileId: string,
  mentorProfileId: string,
  initiatedBy: 'mentee' | 'mentor' | 'system'
): Promise<string> {
  // Calculate match details
  const { matchPercentage, categoryScores } = calculateMatchScore(
    menteeProfile,
    mentorProfile
  );
  
  const match: Match = {
    menteeId: menteeProfile.UID,
    mentorId: mentorProfile.UID,
    menteeProfileId,
    mentorProfileId,
    matchedAt: new Date(),
    matchPercentage,
    matchDetails: {
      technicalInterestsScore: categoryScores.technicalInterests,
      lifeExperiencesScore: categoryScores.lifeExperiences,
      languagesScore: categoryScores.languages,
      menteeWeights: menteeProfile.weights || {
        technicalInterests: 3,
        lifeExperiences: 3,
        languages: 3
      },
      mentorWeights: mentorProfile.weights || {
        technicalInterests: 3,
        lifeExperiences: 3,
        languages: 3
      }
    },
    status: 'pending',
    initiatedBy
  };
  
  return await matchDb.createMatchAsync(match);
}

/**
 * Get all matches for a user (as mentee or mentor)
 */
export async function getUserMatches(userId: string): Promise<Match[]> {
  return await matchDb.getMatchesByUserIdAsync(userId);
}

/**
 * Update match status
 */
export async function updateMatchStatus(
  matchId: string,
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined'
): Promise<void> {
  await matchDb.updateMatchStatusAsync(matchId, status);
}

/**
 * Get a specific match by ID
 */
export async function getMatchById(matchId: string): Promise<Match | null> {
  return await matchDb.getMatchByIdAsync(matchId);
}

const matchingService = {
  calculateMatchScore,
  findMentorMatches,
  findMenteeMatches,
  createMatch,
  getUserMatches,
  updateMatchStatus,
  getMatchById
};

export default matchingService;
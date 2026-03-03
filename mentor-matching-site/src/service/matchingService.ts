/**
 * MATCHING SERVICE - REVAMPED
 * Handles weighted matching using Ratio of Lesser Value and Priority-based weighting.
 */

import { MatchProfile, CalculatedMatch, Match } from "../types/matchProfile";
import matchDb from "../dal/matchDb";

// ============================================
// Core Logic Helpers
// ============================================

/**
 * Calculates the ratio of common items between two arrays.
 * Logic: (Number of mentor matches) / (Total items mentee requested)
 * This fulfills the "Ratio of the Lesser" requirement for list-based data.
 */
function calculateArrayRatio(menteeItems: string[], mentorItems: string[]): number {
  // Filter out "prefer not to share" options
  const filterSkipOptions = (items: string[]) => 
    items.filter(item => !item.toLowerCase().includes('prefer not to share'));
  
  const filteredMenteeItems = filterSkipOptions(menteeItems || []);
  const filteredMentorItems = filterSkipOptions(mentorItems || []);
  
  if (filteredMenteeItems.length === 0) return 1; // Mentee has no specific requirements
  if (filteredMentorItems.length === 0) return 0; // Mentor has nothing to offer

  const menteeSet = new Set(filteredMenteeItems.map(i => i.toLowerCase().trim()));
  const mentorSet = new Set(filteredMentorItems.map(i => i.toLowerCase().trim()));

  const matches = [...menteeSet].filter(item => mentorSet.has(item)).length;

  // Ratio is matches divided by what the mentee actually wants
  return Math.min(matches / menteeSet.size, 1);
}

// ============================================
// Matching Algorithm
// ============================================

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
  console.log('=== CALCULATING MATCH ===');
  console.log('Mentee weights:', menteeProfile.weights);
  console.log('Mentee life exp:', menteeProfile.lifeExperiences);
  console.log('Mentee languages:', menteeProfile.languages);
  console.log('Mentor life exp:', mentorProfile.lifeExperiences);
  console.log('Mentor languages:', mentorProfile.languages);
  
  // 1. Get Weights (Default to 3 if missing)
  const mWeights = menteeProfile.weights || {
    technicalInterests: 3,
    lifeExperiences: 3,
    languages: 3
  };

  // 2. Career & Technical Category (Internal 75/25 split)
  const careerScore = calculateArrayRatio(menteeProfile.careerFields || [], mentorProfile.careerFields || []);
  const techScore = calculateArrayRatio(menteeProfile.technicalInterests || [], mentorProfile.technicalInterests || []);
  
  const careerTechCombined = (careerScore * 0.75) + (techScore * 0.25);

  // 3. Other Categories
  const lifeExpScore = calculateArrayRatio(menteeProfile.lifeExperiences || [], mentorProfile.lifeExperiences || []);
  const langScore = calculateArrayRatio(menteeProfile.languages || [], mentorProfile.languages || []);

  console.log('Scores - Career/Tech:', careerTechCombined, 'Life:', lifeExpScore, 'Lang:', langScore);

  // 4. Overall Match based on Mentee Priority
  const categories = [
    { id: 'tech', score: careerTechCombined, weight: mWeights.technicalInterests },
    { id: 'life', score: lifeExpScore, weight: mWeights.lifeExperiences },
    { id: 'lang', score: langScore, weight: mWeights.languages }
  ];

  // Check if all weights are equal
  const allEqual = mWeights.technicalInterests === mWeights.lifeExperiences && 
                   mWeights.lifeExperiences === mWeights.languages;

  let finalMatchPercentage: number;

  if (allEqual) {
    // Equal weights: use simple average (33.3% each)
    finalMatchPercentage = (careerTechCombined + lifeExpScore + langScore) / 3;
    console.log('Equal weights - using average:', careerTechCombined, '+', lifeExpScore, '+', langScore, '/ 3 =', finalMatchPercentage);
  } else {
    // Different weights: use priority system (50/25/25)
    const sorted = [...categories].sort((a, b) => b.weight - a.weight);
    console.log('Priority order:', sorted.map(c => `${c.id}(${c.weight}): ${c.score}`));
    
    const priorityScore = sorted[0].score; 
    const secondaryScore = sorted[1].score;
    const tertiaryScore = sorted[2].score;

    finalMatchPercentage = (priorityScore * 0.50) + (secondaryScore * 0.25) + (tertiaryScore * 0.25);
    console.log('Final calculation:', priorityScore, '* 0.50 +', secondaryScore, '* 0.25 +', tertiaryScore, '* 0.25 =', finalMatchPercentage);
  }

  console.log('Final percentage:', Math.round(finalMatchPercentage * 1000) / 10);

  return {
    matchPercentage: Math.round(finalMatchPercentage * 1000) / 10, // Result like 85.5
    categoryScores: {
      technicalInterests: Math.round(careerTechCombined * 100),
      lifeExperiences: Math.round(lifeExpScore * 100),
      languages: Math.round(langScore * 100)
    }
  };
}

// ============================================
// Discovery Functions
// ============================================

export async function findMentorMatches(
  menteeProfile: MatchProfile,
  mentorProfiles: MatchProfile[],
  minMatchPercentage: number = 0
): Promise<CalculatedMatch[]> {
  const matches: CalculatedMatch[] = [];
  
  for (const mentorProfile of mentorProfiles) {
    // PREVENT SELF-MATCHING: Skip if same user
    if (mentorProfile.UID === menteeProfile.UID) {
      console.log('⚠️ Skipping self-match:', mentorProfile.UID);
      continue;
    }
    
    if (mentorProfile.isActive === false) continue;
    
    // Check capacity
    if (mentorProfile.maxMatches && 
        mentorProfile.currentMatchCount &&
        mentorProfile.currentMatchCount >= mentorProfile.maxMatches) {
      continue;
    }
    
    const { matchPercentage, categoryScores } = calculateMatchScore(menteeProfile, mentorProfile);
    
    if (matchPercentage >= minMatchPercentage) {
      matches.push({
        profileId: '', 
        userId: mentorProfile.UID,
        userType: 'mentor',
        matchPercentage,
        categoryScores,
        profile: mentorProfile
      });
    }
  }
  
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

export async function findMenteeMatches(
  mentorProfile: MatchProfile,
  menteeProfiles: MatchProfile[],
  minMatchPercentage: number = 0
): Promise<CalculatedMatch[]> {
  const matches: CalculatedMatch[] = [];
  
  for (const menteeProfile of menteeProfiles) {
    // PREVENT SELF-MATCHING: Skip if same user
    if (menteeProfile.UID === mentorProfile.UID) {
      console.log('⚠️ Skipping self-match:', menteeProfile.UID);
      continue;
    }
    
    if (menteeProfile.isActive === false) continue;
    
    const { matchPercentage, categoryScores } = calculateMatchScore(menteeProfile, mentorProfile);
    
    if (matchPercentage >= minMatchPercentage) {
      matches.push({
        profileId: '',
        userId: menteeProfile.UID,
        userType: 'mentee',
        matchPercentage,
        categoryScores,
        profile: menteeProfile
      });
    }
  }
  
  return matches.sort((a, b) => b.matchPercentage - a.matchPercentage);
}

// ============================================
// Match Management
// ============================================

export async function createMatch(
  menteeProfile: MatchProfile,
  mentorProfile: MatchProfile,
  menteeProfileId: string,
  mentorProfileId: string,
  initiatedBy: 'mentee' | 'mentor' | 'system'
): Promise<string> {
  const { matchPercentage, categoryScores } = calculateMatchScore(menteeProfile, mentorProfile);
  
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

export async function getUserMatches(userId: string): Promise<Match[]> {
  return await matchDb.getMatchesByUserIdAsync(userId);
}

export async function updateMatchStatus(
  matchId: string,
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined'
): Promise<void> {
  await matchDb.updateMatchStatusAsync(matchId, status);
}

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
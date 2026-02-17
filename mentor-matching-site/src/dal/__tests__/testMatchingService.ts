/**
 * TEST FILE FOR MATCHING ALGORITHM
 * 
 * This file tests the matchingService functionality:
 * 1. Calculate match scores between profiles
 * 2. Find potential matches
 * 3. Test different weight combinations
 * 
 * HOW TO USE:
 * 1. Create this file at src/dal/__tests__/testMatchingService.ts
 * 2. Import and use in a component or run in browser console
 */

import matchingService from '../../service/matchingService';
import { MatchProfile } from '../../types/matchProfile';

/**
 * Create sample mentee profiles for testing
 */
const sampleMentees: MatchProfile[] = [
  {
    UID: 'mentee-001',
    technicalInterest: 'Python', // Legacy field
    technicalExperience: 3,
    professionalInterest: 'Software Engineering',
    professionalExperience: 2,
    
    // New matching fields
    careerFields: ['Computer Science', 'Artificial Intelligence'],
    technicalInterests: ['Python', 'Machine Learning', 'Java'],
    lifeExperiences: ['Parent', 'International Student'],
    languages: ['English', 'Spanish'],
    weights: {
      technicalInterests: 5, // Very important
      lifeExperiences: 3,    // Moderate
      languages: 2           // Slightly important
    },
    introduction: 'Computer Science student passionate about AI',
    mentorshipGoal: 'Score an Internship',
    isActive: true
  },
  {
    UID: 'mentee-002',
    technicalInterest: 'Web Development',
    technicalExperience: 1,
    professionalInterest: 'Frontend',
    professionalExperience: 1,
    
    careerFields: ['Computer Science'],
    technicalInterests: ['JavaScript', 'React', 'Web Development'],
    lifeExperiences: ['LGBTQ+', 'Unsure about career path'],
    languages: ['English'],
    weights: {
      technicalInterests: 4,
      lifeExperiences: 5, // Very important
      languages: 1
    },
    introduction: 'Junior developer looking for guidance',
    mentorshipGoal: 'Career Guidance',
    isActive: true
  },
  {
    UID: 'mentee-003',
    technicalInterest: 'Cybersecurity',
    technicalExperience: 4,
    professionalInterest: 'Security',
    professionalExperience: 3,
    
    careerFields: ['Cybersecurity'],
    technicalInterests: ['Network Security', 'Penetration Testing', 'Python'],
    lifeExperiences: ['Military Service'],
    languages: ['English', 'Mandarin'],
    weights: {
      technicalInterests: 5,
      lifeExperiences: 4,
      languages: 3
    },
    introduction: 'Veteran transitioning to cybersecurity',
    mentorshipGoal: 'Practice Interview Skills',
    isActive: true
  }
];

/**
 * Create sample mentor profiles for testing
 */
const sampleMentors: MatchProfile[] = [
  {
    UID: 'mentor-001',
    technicalInterest: 'AI/ML',
    technicalExperience: 5,
    professionalInterest: 'Research',
    professionalExperience: 5,
    
    careerFields: ['Artificial Intelligence', 'Computer Science'],
    technicalInterests: ['Python', 'Machine Learning', 'Deep Learning', 'Data Science'],
    lifeExperiences: ['Parent', 'International Student'],
    languages: ['English', 'Spanish', 'Portuguese'],
    weights: {
      technicalInterests: 4,
      lifeExperiences: 3,
      languages: 3
    },
    introduction: 'Senior ML Engineer at tech company',
    areasOfExpertise: ['Machine Learning', 'Career Development', 'Interview Prep'],
    isActive: true,
    maxMatches: 5,
    currentMatchCount: 1
  },
  {
    UID: 'mentor-002',
    technicalInterest: 'Web Development',
    technicalExperience: 5,
    professionalInterest: 'Full Stack',
    professionalExperience: 5,
    
    careerFields: ['Computer Science'],
    technicalInterests: ['JavaScript', 'React', 'Node.js', 'Web Development'],
    lifeExperiences: ['LGBTQ+', 'Parent'],
    languages: ['English'],
    weights: {
      technicalInterests: 3,
      lifeExperiences: 5, // Very important to mentor
      languages: 2
    },
    introduction: 'Full-stack developer, passionate about mentorship',
    areasOfExpertise: ['Web Development', 'Work-Life Balance', 'Career Transitions'],
    isActive: true,
    maxMatches: 3,
    currentMatchCount: 0
  },
  {
    UID: 'mentor-003',
    technicalInterest: 'Security',
    technicalExperience: 5,
    professionalInterest: 'Cybersecurity',
    professionalExperience: 5,
    
    careerFields: ['Cybersecurity'],
    technicalInterests: ['Network Security', 'Cryptography', 'Python'],
    lifeExperiences: ['Military Service', 'Parent'],
    languages: ['English', 'German'],
    weights: {
      technicalInterests: 5,
      lifeExperiences: 4,
      languages: 2
    },
    introduction: 'Security architect with 10+ years experience',
    areasOfExpertise: ['Cybersecurity', 'Career Development'],
    isActive: true,
    maxMatches: 4,
    currentMatchCount: 0
  }
];

/**
 * Test 1: Calculate match score between two profiles
 */
export function testCalculateMatchScore() {
  console.log('🧪 TEST 1: Calculate Match Score\n');
  
  try {
    const mentee = sampleMentees[0]; // AI/ML mentee
    const mentor = sampleMentors[0]; // AI/ML mentor
    
    console.log('Mentee Profile:');
    console.log(`  - Technical: ${mentee.technicalInterests?.join(', ')}`);
    console.log(`  - Life Exp: ${mentee.lifeExperiences?.join(', ')}`);
    console.log(`  - Languages: ${mentee.languages?.join(', ')}`);
    console.log(`  - Weights: Tech=${mentee.weights?.technicalInterests}, Life=${mentee.weights?.lifeExperiences}, Lang=${mentee.weights?.languages}`);
    
    console.log('\nMentor Profile:');
    console.log(`  - Technical: ${mentor.technicalInterests?.join(', ')}`);
    console.log(`  - Life Exp: ${mentor.lifeExperiences?.join(', ')}`);
    console.log(`  - Languages: ${mentor.languages?.join(', ')}`);
    console.log(`  - Weights: Tech=${mentor.weights?.technicalInterests}, Life=${mentor.weights?.lifeExperiences}, Lang=${mentor.weights?.languages}`);
    
    const result = matchingService.calculateMatchScore(mentee, mentor);
    
    console.log('\n✅ MATCH RESULTS:');
    console.log(`  Overall Match: ${result.matchPercentage}%`);
    console.log(`  - Technical Interests: ${result.categoryScores.technicalInterests}%`);
    console.log(`  - Life Experiences: ${result.categoryScores.lifeExperiences}%`);
    console.log(`  - Languages: ${result.categoryScores.languages}%`);
    
    return result;
  } catch (error) {
    console.error('❌ ERROR:', error);
    throw error;
  }
}

/**
 * Test 2: Find all mentor matches for a mentee
 */
export async function testFindMentorMatches() {
  console.log('\n🧪 TEST 2: Find Mentor Matches\n');
  
  try {
    const mentee = sampleMentees[0]; // AI/ML mentee
    
    console.log(`Finding matches for mentee: ${mentee.introduction}`);
    console.log(`Min match threshold: 30%\n`);
    
    const matches = await matchingService.findMentorMatches(
      mentee,
      sampleMentors,
      30 // 30% minimum match
    );
    
    console.log(`✅ Found ${matches.length} matches:\n`);
    
    matches.forEach((match, index) => {
      console.log(`${index + 1}. ${match.profile.introduction}`);
      console.log(`   Match: ${match.matchPercentage}%`);
      console.log(`   Breakdown: Tech=${match.categoryScores.technicalInterests}%, Life=${match.categoryScores.lifeExperiences}%, Lang=${match.categoryScores.languages}%`);
      console.log('');
    });
    
    return matches;
  } catch (error) {
    console.error('❌ ERROR:', error);
    throw error;
  }
}

/**
 * Test 3: Compare different weight combinations
 */
export function testWeightCombinations() {
  console.log('\n🧪 TEST 3: Weight Combinations Effect\n');
  
  try {
    const mentee = sampleMentees[0];
    const mentor = sampleMentors[0];
    
    console.log('Testing how different weights affect matching...\n');
    
    // Test different weight scenarios
    const scenarios = [
      { name: 'Tech Focus', weights: { technicalInterests: 5, lifeExperiences: 1, languages: 1 } },
      { name: 'Life Experience Focus', weights: { technicalInterests: 1, lifeExperiences: 5, languages: 1 } },
      { name: 'Language Focus', weights: { technicalInterests: 1, lifeExperiences: 1, languages: 5 } },
      { name: 'Balanced', weights: { technicalInterests: 3, lifeExperiences: 3, languages: 3 } }
    ];
    
    scenarios.forEach(scenario => {
      const testMentee = { ...mentee, weights: scenario.weights };
      const result = matchingService.calculateMatchScore(testMentee, mentor);
      
      console.log(`${scenario.name}:`);
      console.log(`  Weights: Tech=${scenario.weights.technicalInterests}, Life=${scenario.weights.lifeExperiences}, Lang=${scenario.weights.languages}`);
      console.log(`  Overall Match: ${result.matchPercentage}%`);
      console.log('');
    });
    
    console.log('✅ Weight comparison complete!');
  } catch (error) {
    console.error('❌ ERROR:', error);
    throw error;
  }
}

/**
 * Test 4: Test with perfect match (same profile)
 */
export function testPerfectMatch() {
  console.log('\n🧪 TEST 4: Perfect Match Test\n');
  
  try {
    const profile = sampleMentees[0];
    
    console.log('Testing a profile against itself (should be ~100%)...\n');
    
    const result = matchingService.calculateMatchScore(profile, profile);
    
    console.log('✅ RESULTS:');
    console.log(`  Overall Match: ${result.matchPercentage}%`);
    console.log(`  - Technical: ${result.categoryScores.technicalInterests}%`);
    console.log(`  - Life: ${result.categoryScores.lifeExperiences}%`);
    console.log(`  - Languages: ${result.categoryScores.languages}%`);
    
    if (result.matchPercentage >= 95) {
      console.log('\n✅ Perfect match works correctly!');
    } else {
      console.warn('\n⚠️  Expected higher match percentage for identical profiles');
    }
    
    return result;
  } catch (error) {
    console.error('❌ ERROR:', error);
    throw error;
  }
}

/**
 * Test 5: Test with no overlap (poor match)
 */
export function testPoorMatch() {
  console.log('\n🧪 TEST 5: Poor Match Test\n');
  
  try {
    const aiMentee = sampleMentees[0]; // AI/ML focus
    const webMentor = sampleMentors[1]; // Web dev focus
    
    console.log('Testing profiles with little overlap...\n');
    console.log(`Mentee: ${aiMentee.technicalInterests?.join(', ')}`);
    console.log(`Mentor: ${webMentor.technicalInterests?.join(', ')}`);
    
    const result = matchingService.calculateMatchScore(aiMentee, webMentor);
    
    console.log('\n✅ RESULTS:');
    console.log(`  Overall Match: ${result.matchPercentage}%`);
    console.log(`  - Technical: ${result.categoryScores.technicalInterests}%`);
    console.log(`  - Life: ${result.categoryScores.lifeExperiences}%`);
    console.log(`  - Languages: ${result.categoryScores.languages}%`);
    
    return result;
  } catch (error) {
    console.error('❌ ERROR:', error);
    throw error;
  }
}

/**
 * Test 6: Test all mentees against all mentors
 */
export async function testAllCombinations() {
  console.log('\n🧪 TEST 6: All Combinations Matrix\n');
  
  try {
    console.log('Testing all mentees against all mentors...\n');
    
    sampleMentees.forEach((mentee, i) => {
      console.log(`\n--- Mentee ${i + 1}: ${mentee.introduction} ---`);
      
      sampleMentors.forEach((mentor, j) => {
        const result = matchingService.calculateMatchScore(mentee, mentor);
        console.log(`  vs Mentor ${j + 1}: ${result.matchPercentage}% - ${mentor.introduction}`);
      });
    });
    
    console.log('\n✅ All combinations tested!');
  } catch (error) {
    console.error('❌ ERROR:', error);
    throw error;
  }
}

/**
 * RUN ALL TESTS
 */
export async function runAllMatchingTests() {
  console.log('🚀 Starting Matching Algorithm Tests...\n');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Basic match calculation
    testCalculateMatchScore();
    console.log('\n' + '='.repeat(60));
    
    // Test 2: Find matches
    await testFindMentorMatches();
    console.log('='.repeat(60));
    
    // Test 3: Weight effects
    testWeightCombinations();
    console.log('='.repeat(60));
    
    // Test 4: Perfect match
    testPerfectMatch();
    console.log('='.repeat(60));
    
    // Test 5: Poor match
    testPoorMatch();
    console.log('='.repeat(60));
    
    // Test 6: All combinations
    await testAllCombinations();
    console.log('='.repeat(60));
    
    console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    
  } catch (error) {
    console.error('\n💥 TEST SUITE FAILED:', error);
    throw error;
  }
}

/**
 * QUICK TEST - Just the basics
 */
export async function quickMatchingTest() {
  console.log('⚡ Running quick matching test...\n');
  
  testCalculateMatchScore();
  console.log('\n---\n');
  await testFindMentorMatches();
  
  console.log('\n✅ Quick test complete!');
}

// Export for easy use
export default {
  runAllMatchingTests,
  quickMatchingTest,
  testCalculateMatchScore,
  testFindMentorMatches,
  testWeightCombinations,
  testPerfectMatch,
  testPoorMatch,
  testAllCombinations,
  // Export sample data for custom testing
  sampleMentees,
  sampleMentors
};

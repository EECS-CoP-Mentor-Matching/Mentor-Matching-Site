/**
 * TEST FILE FOR MATCH DATABASE
 * 
 * This file tests the matchDb functionality to ensure it can:
 * 1. Create a match in Firestore
 * 2. Retrieve the match by ID
 * 3. Query matches by user ID
 * 4. Update match status
 * 
 * HOW TO USE:
 * 1. Create this file in your project (e.g., src/test/testMatchDb.ts)
 * 2. Import it in a component or run it in your browser console
 * 3. Check Firestore console to see the data
 */

import matchDb from '../matchDb';
import { Match } from '../../types/matchProfile';

/**
 * Test 1: Create a match
 */
export async function testCreateMatch() {
  console.log('🧪 TEST 1: Creating a match...');
  
  try {
    const testMatch: Match = {
      menteeId: 'test-mentee-uid-123',
      mentorId: 'test-mentor-uid-456',
      menteeProfileId: 'test-mentee-profile-abc',
      mentorProfileId: 'test-mentor-profile-def',
      matchedAt: new Date(),
      matchPercentage: 75.5,
      matchDetails: {
        technicalInterestsScore: 80,
        lifeExperiencesScore: 70,
        languagesScore: 76,
        menteeWeights: {
          technicalInterests: 5,
          lifeExperiences: 3,
          languages: 2
        },
        mentorWeights: {
          technicalInterests: 4,
          lifeExperiences: 4,
          languages: 3
        }
      },
      status: 'pending',
      initiatedBy: 'mentee',
      notes: 'Test match created for database testing'
    };
    
    const matchId = await matchDb.createMatchAsync(testMatch);
    
    console.log('✅ SUCCESS! Match created with ID:', matchId);
    console.log('📊 Match data:', testMatch);
    console.log('👉 Check Firestore console: matches collection');
    
    return matchId;
  } catch (error) {
    console.error('❌ ERROR creating match:', error);
    throw error;
  }
}

/**
 * Test 2: Retrieve match by ID
 */
export async function testGetMatchById(matchId: string) {
  console.log('🧪 TEST 2: Retrieving match by ID...');
  console.log('Looking for match ID:', matchId);
  
  try {
    const match = await matchDb.getMatchByIdAsync(matchId);
    
    if (match) {
      console.log('✅ SUCCESS! Found match:', match);
      console.log('Match percentage:', match.matchPercentage + '%');
      console.log('Status:', match.status);
      return match;
    } else {
      console.log('⚠️  No match found with that ID');
      return null;
    }
  } catch (error) {
    console.error('❌ ERROR retrieving match:', error);
    throw error;
  }
}

/**
 * Test 3: Get all matches for a user
 */
export async function testGetUserMatches(userId: string) {
  console.log('🧪 TEST 3: Getting all matches for user:', userId);
  
  try {
    const matches = await matchDb.getMatchesByUserIdAsync(userId);
    
    console.log('✅ SUCCESS! Found', matches.length, 'matches');
    matches.forEach((match, index) => {
      console.log(`Match ${index + 1}:`, {
        matchId: match.matchId,
        percentage: match.matchPercentage + '%',
        status: match.status,
        role: match.menteeId === userId ? 'mentee' : 'mentor'
      });
    });
    
    return matches;
  } catch (error) {
    console.error('❌ ERROR getting user matches:', error);
    throw error;
  }
}

/**
 * Test 4: Update match status
 */
export async function testUpdateMatchStatus(matchId: string, newStatus: 'pending' | 'accepted' | 'active' | 'completed' | 'declined') {
  console.log(`🧪 TEST 4: Updating match status to "${newStatus}"...`);
  
  try {
    await matchDb.updateMatchStatusAsync(matchId, newStatus);
    
    console.log('✅ SUCCESS! Match status updated');
    
    // Verify the update
    const updatedMatch = await matchDb.getMatchByIdAsync(matchId);
    console.log('Updated status:', updatedMatch?.status);
    console.log('Timestamp set:', 
      newStatus === 'accepted' ? updatedMatch?.acceptedAt :
      newStatus === 'completed' ? updatedMatch?.completedAt :
      newStatus === 'declined' ? updatedMatch?.declinedAt : 'N/A'
    );
    
    return updatedMatch;
  } catch (error) {
    console.error('❌ ERROR updating match status:', error);
    throw error;
  }
}

/**
 * Test 5: Get matches by status
 */
export async function testGetMatchesByStatus(status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined') {
  console.log(`🧪 TEST 5: Getting all "${status}" matches...`);
  
  try {
    const matches = await matchDb.getMatchesByStatusAsync(status);
    
    console.log(`✅ SUCCESS! Found ${matches.length} "${status}" matches`);
    matches.forEach((match, index) => {
      console.log(`Match ${index + 1}:`, {
        matchId: match.matchId,
        menteeId: match.menteeId,
        mentorId: match.mentorId,
        percentage: match.matchPercentage + '%'
      });
    });
    
    return matches;
  } catch (error) {
    console.error('❌ ERROR getting matches by status:', error);
    throw error;
  }
}

/**
 * RUN ALL TESTS IN SEQUENCE
 * This is the main function you'll call
 */
export async function runAllMatchDbTests() {
  console.log('🚀 Starting Match Database Tests...\n');
  
  try {
    // Test 1: Create a match
    const matchId = await testCreateMatch();
    console.log('\n---\n');
    
    // Wait a bit for Firestore to process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 2: Get the match we just created
    await testGetMatchById(matchId);
    console.log('\n---\n');
    
    // Test 3: Get all matches for the mentee
    await testGetUserMatches('test-mentee-uid-123');
    console.log('\n---\n');
    
    // Test 4: Update the match status
    await testUpdateMatchStatus(matchId, 'accepted');
    console.log('\n---\n');
    
    // Test 5: Get all pending matches
    await testGetMatchesByStatus('pending');
    console.log('\n---\n');
    
    console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log('👉 Check your Firestore console to see the "matches" collection');
    console.log('👉 You can manually delete the test data when done');
    
    return matchId; // Return so you can use it for cleanup
    
  } catch (error) {
    console.error('💥 TEST SUITE FAILED:', error);
    throw error;
  }
}

/**
 * CLEANUP: Delete test data
 */
export async function cleanupTestMatch(matchId: string) {
  console.log('🧹 Cleaning up test match:', matchId);
  
  try {
    // Note: You'll need to add a delete function to matchDb.ts
    // For now, delete manually in Firestore console
    console.log('⚠️  Please delete this match manually in Firestore console');
    console.log('Collection: matches');
    console.log('Document ID:', matchId);
  } catch (error) {
    console.error('❌ ERROR during cleanup:', error);
  }
}

/**
 * QUICK TEST: Just create one match and verify
 */
export async function quickTest() {
  console.log('⚡ Running quick test...\n');
  
  const matchId = await testCreateMatch();
  console.log('\n---\n');
  await testGetMatchById(matchId);
  
  console.log('\n✅ Quick test complete!');
  console.log('Match ID:', matchId);
  
  return matchId;
}

// Export for easy use
export default {
  runAllMatchDbTests,
  quickTest,
  testCreateMatch,
  testGetMatchById,
  testGetUserMatches,
  testUpdateMatchStatus,
  testGetMatchesByStatus,
  cleanupTestMatch
};

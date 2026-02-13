/**
 * MATCH DATABASE ACCESS LAYER
 * 
 * Handles all Firestore operations for the matches collection
 */

import { collection, doc, setDoc, getDoc, getDocs, query, where, Timestamp, updateDoc, orderBy } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Match } from "../types/matchProfile";
import { DocItem } from "../types/types";

const collectionName = 'matches';

/**
 * Create a new match in Firestore
 * @returns The document ID of the created match
 */
async function createMatchAsync(match: Match): Promise<string> {
  const matchRef = doc(collection(db, collectionName));
  const matchId = matchRef.id;
  
  const matchData = {
    ...match,
    matchId,
    matchedAt: Timestamp.now(),
    acceptedAt: null,
    completedAt: null,
    declinedAt: null
  };
  
  await setDoc(matchRef, matchData);
  return matchId;
}

/**
 * Get a match by its ID
 */
async function getMatchByIdAsync(matchId: string): Promise<Match | null> {
  const matchRef = doc(db, collectionName, matchId);
  const matchSnap = await getDoc(matchRef);
  
  if (matchSnap.exists()) {
    return matchSnap.data() as Match;
  }
  return null;
}

/**
 * Get all matches for a specific user (either as mentee or mentor)
 */
async function getMatchesByUserIdAsync(userId: string): Promise<Match[]> {
  // Query for matches where user is mentee
  const menteeQuery = query(
    collection(db, collectionName),
    where('menteeId', '==', userId)
    // Removed orderBy to avoid needing an index
  );
  
  // Query for matches where user is mentor
  const mentorQuery = query(
    collection(db, collectionName),
    where('mentorId', '==', userId)
    // Removed orderBy to avoid needing an index
  );
  
  const [menteeSnap, mentorSnap] = await Promise.all([
    getDocs(menteeQuery),
    getDocs(mentorQuery)
  ]);
  
  const matches: Match[] = [];
  
  menteeSnap.forEach(doc => {
    matches.push(doc.data() as Match);
  });
  
  mentorSnap.forEach(doc => {
    matches.push(doc.data() as Match);
  });
  
  // Sort by date in JavaScript instead (most recent first)
  return matches.sort((a, b) => {
    const dateA = a.matchedAt?.toDate?.() || new Date(a.matchedAt);
    const dateB = b.matchedAt?.toDate?.() || new Date(b.matchedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get matches between specific mentee and mentor profiles
 */
async function getMatchBetweenProfilesAsync(
  menteeProfileId: string,
  mentorProfileId: string
): Promise<Match | null> {
  const q = query(
    collection(db, collectionName),
    where('menteeProfileId', '==', menteeProfileId),
    where('mentorProfileId', '==', mentorProfileId)
  );
  
  const querySnap = await getDocs(q);
  
  if (!querySnap.empty) {
    return querySnap.docs[0].data() as Match;
  }
  return null;
}

/**
 * Update match status
 */
async function updateMatchStatusAsync(
  matchId: string,
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined'
): Promise<void> {
  const matchRef = doc(db, collectionName, matchId);
  
  const updateData: any = { status };
  
  // Add timestamp for status change
  switch (status) {
    case 'accepted':
      updateData.acceptedAt = Timestamp.now();
      break;
    case 'completed':
      updateData.completedAt = Timestamp.now();
      break;
    case 'declined':
      updateData.declinedAt = Timestamp.now();
      break;
  }
  
  await updateDoc(matchRef, updateData);
}

/**
 * Get all active matches for a mentor (to check capacity)
 */
async function getActiveMentorMatchesAsync(mentorId: string): Promise<Match[]> {
  const q = query(
    collection(db, collectionName),
    where('mentorId', '==', mentorId),
    where('status', 'in', ['pending', 'accepted', 'active'])
  );
  
  const querySnap = await getDocs(q);
  const matches: Match[] = [];
  
  querySnap.forEach(doc => {
    matches.push(doc.data() as Match);
  });
  
  return matches;
}

/**
 * Get all matches by status
 */
async function getMatchesByStatusAsync(
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'declined'
): Promise<Match[]> {
  const q = query(
    collection(db, collectionName),
    where('status', '==', status)
    // Removed orderBy to avoid needing an index
  );
  
  const querySnap = await getDocs(q);
  const matches: Match[]  = [];
  
  querySnap.forEach(doc => {
    matches.push(doc.data() as Match);
  });
  
  // Sort in JavaScript instead
  return matches.sort((a, b) => {
    const dateA = a.matchedAt?.toDate?.() || new Date(a.matchedAt);
    const dateB = b.matchedAt?.toDate?.() || new Date(b.matchedAt);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Add notes to a match
 */
async function addMatchNotesAsync(matchId: string, notes: string): Promise<void> {
  const matchRef = doc(db, collectionName, matchId);
  await updateDoc(matchRef, { notes });
}

const matchDb = {
  createMatchAsync,
  getMatchByIdAsync,
  getMatchesByUserIdAsync,
  getMatchBetweenProfilesAsync,
  updateMatchStatusAsync,
  getActiveMentorMatchesAsync,
  getMatchesByStatusAsync,
  addMatchNotesAsync
};

export default matchDb;

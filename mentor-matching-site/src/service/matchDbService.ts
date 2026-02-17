import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserWeights } from '../types/matchProfile';

const COLLECTION_NAME = 'matches';

export interface Match {
  matchId?: string;
  menteeId: string;
  mentorId: string;
  menteeProfileId: string;
  mentorProfileId: string;
  matchPercentage: number;
  matchDetails: {
    technicalInterestsScore: number;
    lifeExperiencesScore: number;
    languagesScore: number;
    menteeWeights: UserWeights;
    mentorWeights: UserWeights;
  };
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  initiatedBy: 'mentee' | 'mentor';
  matchedAt: Timestamp;
  acceptedAt?: Timestamp | null;
  declinedAt?: Timestamp | null;
  completedAt?: Timestamp | null;
  notes?: string;
}

/**
 * Create a new match request
 */
async function createMatch(match: Omit<Match, 'matchId'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...match,
    matchedAt: Timestamp.now()
  });
  
  // Update the document with its own ID
  await updateDoc(docRef, {
    matchId: docRef.id
  });
  
  return docRef.id;
}

/**
 * Update match status (accept/decline)
 */
async function updateMatchStatus(
  matchId: string, 
  status: 'accepted' | 'declined' | 'completed'
): Promise<void> {
  const matchRef = doc(db, COLLECTION_NAME, matchId);
  const updateData: any = { status };
  
  if (status === 'accepted') {
    updateData.acceptedAt = Timestamp.now();
  } else if (status === 'declined') {
    updateData.declinedAt = Timestamp.now();
  } else if (status === 'completed') {
    updateData.completedAt = Timestamp.now();
  }
  
  await updateDoc(matchRef, updateData);
}

/**
 * Get all pending matches for a mentor
 */
async function getPendingMatchesForMentor(mentorId: string): Promise<Match[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('mentorId', '==', mentorId),
    where('status', '==', 'pending')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Match);
}

/**
 * Get all matches for a mentee (pending, accepted, declined)
 */
async function getMatchesForMentee(menteeId: string): Promise<Match[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('menteeId', '==', menteeId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Match);
}

/**
 * Check if a match already exists between mentee and mentor
 */
async function matchExists(menteeProfileId: string, mentorProfileId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('menteeProfileId', '==', menteeProfileId),
    where('mentorProfileId', '==', mentorProfileId)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

const matchDbService = {
  createMatch,
  updateMatchStatus,
  getPendingMatchesForMentor,
  getMatchesForMentee,
  matchExists
};

export default matchDbService;

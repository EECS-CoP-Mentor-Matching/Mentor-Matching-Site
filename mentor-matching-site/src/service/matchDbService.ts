import { collection, addDoc, updateDoc, doc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { UserWeights } from '../types/matchProfile';

const COLLECTION_NAME = 'matches';

export interface Match {
  matchId: string;  // Always present after creation
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
  status: 'pending' | 'accepted' | 'declined' | 'completed' | 'ended';
  initiatedBy: 'mentee' | 'mentor';
  matchedAt: Timestamp;
  acceptedAt?: Timestamp | null;
  declinedAt?: Timestamp | null;
  completedAt?: Timestamp | null;
  endedAt?: Timestamp | null;
  endedBy?: 'mentee' | 'mentor' | null;
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
 * Check if an ACTIVE match already exists between mentee and mentor
 * Ended/declined matches are ignored so reconnection is possible
 */
async function matchExists(menteeProfileId: string, mentorProfileId: string): Promise<boolean> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('menteeProfileId', '==', menteeProfileId),
    where('mentorProfileId', '==', mentorProfileId)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return false;
  
  // Only block if there is a pending or accepted match (not ended/declined)
  const activeMatch = snapshot.docs.find(doc => {
    const status = doc.data().status;
    return status === 'pending' || status === 'accepted';
  });
  return !!activeMatch;
}

/**
 * Get all accepted matches for a mentor (My Mentees)
 */
async function getAcceptedMatchesForMentor(mentorId: string): Promise<Match[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('mentorId', '==', mentorId),
    where('status', '==', 'accepted')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Match);
}

/**
 * End a mentorship - updates status and sends notification message to mentee messages
 */
async function endMentorship(
  matchId: string,
  endedBy: 'mentee' | 'mentor',
  endingUserUID: string,
  notifyUserUID: string,
  endingUserName: string,
  notifyUserName: string,
  menteeUID?: string,
  mentorUID?: string,
  menteeProfileId?: string,
  mentorProfileId?: string
): Promise<void> {
  const matchRef = doc(db, COLLECTION_NAME, matchId);
  await updateDoc(matchRef, {
    status: 'ended',
    endedAt: Timestamp.now(),
    endedBy
  });

  // Message always goes to mentee so it shows in MenteeMessages
  const resolvedMenteeUID = menteeUID || (endedBy === 'mentee' ? endingUserUID : notifyUserUID);
  const resolvedMentorUID = mentorUID || (endedBy === 'mentor' ? endingUserUID : notifyUserUID);

  const notificationMessage = endedBy === 'mentee'
    ? `You have ended your mentorship with ${notifyUserName}. We hope it was a valuable experience!`
    : `${endingUserName} has ended the mentorship with you. We hope it was a valuable learning experience!`;

  const messageCollection = collection(db, 'messages');
  await addDoc(messageCollection, {
    menteeUID: resolvedMenteeUID,
    mentorUID: resolvedMentorUID,
    menteeProfileId: menteeProfileId || '',
    mentorProfileId: mentorProfileId || '',
    message: notificationMessage,
    mentorReply: '',
    technicalInterest: 'Mentorship Notification',
    professionalInterest: `Ended by ${endedBy}`,
    sentByUID: endingUserUID,
    sentOn: Timestamp.now(),
  });
}

const matchDbService = {
  createMatch,
  updateMatchStatus,
  getPendingMatchesForMentor,
  getAcceptedMatchesForMentor,
  getMatchesForMentee,
  matchExists,
  endMentorship
};

export default matchDbService;

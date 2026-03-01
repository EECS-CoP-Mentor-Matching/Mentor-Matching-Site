import { MatchProfile } from "../types/matchProfile";
import { db } from "../firebaseConfig";
import { collection, addDoc, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { queryMany } from "./commonDb";
import { DocItem } from "../types/types";

const collectionName = 'mentorProfile';

// REMOVED: searchMentorsByProfileMatchAsync
// This old matching function is obsolete and replaced by matchingService.findMentorMatches()

async function createMentorProfileAsync(mentorMatchProfile: MatchProfile) {
  try {
    const doc = await addDoc(collection(db, collectionName), mentorMatchProfile);
    return { success: true, id: doc.id };
  } catch (error) {
    return { success: false, error: error };
  }
}

async function editMentorProfileAsync(docId: string, mentorMatchProfile: MatchProfile) {
  try {
    const docRef = doc(db, collectionName, docId);

    await updateDoc(docRef, mentorMatchProfile as { [field: string]: any });

    return { success: true, id: docId };
  } catch (error) {
    return { success: false, error: error };
  }
}

async function deleteMentorProfileAsync(docId: string) {
  try {
    const docRef = doc(db, collectionName, docId);

    await deleteDoc(docRef);

    return { success: true, id: docId };
  } catch (error) {
    return { success: false, error: error };
  }
}

async function searchMentorProfilesByUserAsync(UID: string): Promise<DocItem<MatchProfile>[]> {
  return (await queryMany<MatchProfile>(collectionName, where('UID', '==', UID))).results;
}

const mentorDb = {
  createMentorProfileAsync,
  editMentorProfileAsync,
  deleteMentorProfileAsync,
  searchMentorProfilesByUserAsync
};

export default mentorDb;

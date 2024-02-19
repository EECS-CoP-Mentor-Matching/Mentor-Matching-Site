import { MatchProfile } from "../types/matchProfile";
import { UserProfile } from "../types/userProfile";
import { db } from "../firebaseConfig";
import {collection, getDocs, addDoc, query, where, doc, deleteDoc} from "firebase/firestore";
import { queryMany, writeSingle } from "./commonDb";
import { DocItem } from "../types/types";
import firebase from "firebase/compat";

const collectionName = 'mentorProfile';

async function searchMentorsByProfileMatchAsync(menteeUserProfile: UserProfile, menteeMatchProfile: MatchProfile): Promise<DocItem<MatchProfile>[]> {
  const conditions = []
  conditions.push(where("technicalInterests", "==", menteeMatchProfile.technicalInterest));
  conditions.push(where("technicalExperience", ">", menteeMatchProfile.technicalExperience));
  conditions.push(where("professionalInterest", "==", menteeMatchProfile.professionalInterest));
  conditions.push(where("professionalExperience", ">=", menteeMatchProfile.professionalExperience));
  if (menteeUserProfile.accountSettings.useDemographicsForMatching) {
    conditions.push(where("lgbtqPlusCommunity", "==", menteeUserProfile.demographics.lgbtqPlusCommunity));
    conditions.push(where("racialIdentity", "==", menteeUserProfile.demographics.racialIdentity));
  }

  return (await queryMany<MatchProfile>(collectionName, ...conditions)).results;
}

async function createMentorProfileAsync(mentorMatchProfile: MatchProfile) {
  // Consider using abstracted method
  // const doc = await writeSingle(collectionName, mentorMatchProfile);
  try {
    const doc = await addDoc(collection(db, collectionName), mentorMatchProfile);
    return { success: true, id: doc.id };
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
  searchMentorsByProfileMatchAsync,
  createMentorProfileAsync,
  deleteMentorProfileAsync,
  searchMentorProfilesByUserAsync
};

export default mentorDb;
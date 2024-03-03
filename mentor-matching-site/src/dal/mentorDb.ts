import { MatchProfile } from "../types/matchProfile";
import { UserProfile } from "../types/userProfile";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { queryMany, writeSingle } from "./commonDb";
import { DocItem } from "../types/types";
import menteeService from "../service/menteeService";

const collectionName = 'mentorProfile';

async function searchMentorsByProfileMatchAsync(menteeUserProfileId: string, userProfile: UserProfile): Promise<DocItem<MatchProfile>[]> {
  const menteeMatchProfile = (await menteeService.searchMenteeProfileById(menteeUserProfileId)).data;
  console.log("mentee profile: ", menteeMatchProfile);

  const conditions = [];
  conditions.push(where("UID", "!=", userProfile.UID));
  conditions.push(where("technicalInterest", "==", menteeMatchProfile.technicalInterest));
  conditions.push(where("professionalInterest", "==", menteeMatchProfile.professionalInterest));
  if (userProfile.preferences.useLgbtqPlusCommunityForMatching) {
    conditions.push(where("lgbtqPlusCommunity", "==", userProfile.demographics.lgbtqPlusCommunity));
  }
  if (userProfile.preferences.useRacialIdentityForMatching) {
    conditions.push(where("racialIdentity", "==", userProfile.demographics.racialIdentity));
  }

  const results = (await queryMany<MatchProfile>(collectionName, ...conditions)).results;
  console.log("match results: ", results)
  const matches = new Array<DocItem<MatchProfile>>;
  results.forEach(result => {
    const match = result.data;
    if (match.technicalExperience > menteeMatchProfile.technicalExperience &&
      match.professionalExperience > menteeMatchProfile.professionalExperience) {
      matches.push({
        docId: result.docId,
        data: match
      } as DocItem<MatchProfile>);
    }
  });
  return matches;
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
  searchMentorsByProfileMatchAsync,
  createMentorProfileAsync,
  editMentorProfileAsync,
  deleteMentorProfileAsync,
  searchMentorProfilesByUserAsync
};

export default mentorDb;
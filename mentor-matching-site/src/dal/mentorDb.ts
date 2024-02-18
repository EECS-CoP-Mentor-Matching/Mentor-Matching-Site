import { MatchProfile } from "../types/matchProfile";
import { UserProfile } from "../types/userProfile";
import { db } from "../firebaseConfig";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

async function searchMentorsByProfileMatchAsync(menteeUserProfile: UserProfile, menteeMatchProfile: MatchProfile) {
  const conditions = []
  conditions.push(where("technicalInterests", "==", menteeMatchProfile.technicalInterest));
  conditions.push(where("technicalExperience", ">", menteeMatchProfile.technicalExperience));
  conditions.push(where("professionalInterest", "==", menteeMatchProfile.professionalInterest));
  conditions.push(where("professionalExperience", ">=", menteeMatchProfile.professionalExperience));
  if (menteeUserProfile.accountSettings.useDemographicsForMatching) {
    conditions.push(where("lgbtqPlusCommunity", "==", menteeUserProfile.demographics.lgbtqPlusCommunity));
    conditions.push(where("racialIdentity", "==", menteeUserProfile.demographics.racialIdentity));
  }

  const matchQuery = query(collection(db, "mentorProfile"), ...conditions);
  const matches = await getDocs(matchQuery)
  const matchProfiles = matches.docs.map((doc) => doc.data());
  return matchProfiles;
}

async function createMentorProfileAsync(mentorMatchProfile: MatchProfile) {
  try {
    const doc = await addDoc(collection(db, "mentorProfile"), mentorMatchProfile);
    return { success: true, id: doc.id };
  } catch (error) {
    return { success: false, error: error };
  }
}

async function searchMentorProfilesByUserAsync(UID: string) {
  try {
    const matchQuery = query(collection(db, "mentorProfile"), where("UID", "==", UID));

    const matches = await getDocs(matchQuery);

    const mentorProfiles = matches.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as MatchProfile
    }));

    return { success: true, mentorProfiles };
  } catch (error) {
    return { success: false, error: error };
  }
}

const mentorDb = {
  searchMentorsByProfileMatchAsync,
  createMentorProfileAsync,
  searchMentorProfilesByUserAsync
};

export default mentorDb;
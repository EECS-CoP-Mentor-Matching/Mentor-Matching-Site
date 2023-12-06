import { MatchProfile, UserProfile } from "../types";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, QueryConstraint, where } from "firebase/firestore";

async function searchMentorsByProfileMatch(menteeUserProfile: UserProfile, menteeMatchProfile: MatchProfile) {
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

const mentorDb = {
  searchMentorsByProfileMatch
};

export default mentorDb;
import { MatchProfile } from "../types/matchProfile";
import { UserProfile } from "../types/userProfile";
import { db } from "../firebaseConfig";
import { collection, addDoc, where, doc, deleteDoc, updateDoc, query } from "firebase/firestore";
import { queryMany, querySingle } from "./commonDb";
import { DocItem, UserReport } from "../types/types";
import menteeService from "../service/menteeService";
import userService from "../service/userService";
import { reportUserService } from "../service/reportUserService";

const collectionName = 'mentorProfile';
const userReportsCollectionName = 'userReports'

async function searchMentorsByProfileMatchAsync(menteeUserProfileId: string, userProfile: UserProfile): Promise<DocItem<MatchProfile>[]> {
  const menteeMatchProfile = (await menteeService.searchMenteeProfileById(menteeUserProfileId)).data;

  // search based on interests
  const interestsConditions = [];
  interestsConditions.push(where("UID", "!=", userProfile.UID));
  interestsConditions.push(where("technicalInterest", "==", menteeMatchProfile.technicalInterest));
  interestsConditions.push(where("professionalInterest", "==", menteeMatchProfile.professionalInterest));

  const interestsResults = (await queryMany<MatchProfile>(collectionName, ...interestsConditions)).results;

  const reportedUsersConditions = [];
  reportedUsersConditions.push(where("reportedByUID", "==", userProfile.UID));
  const reportedUsers = (await queryMany<UserReport>(userReportsCollectionName, ...reportedUsersConditions));
  
  // filter by experience level and not in reported users list
  const interestsMatches = new Array<DocItem<MatchProfile>>();
  interestsResults.forEach(result => {
    const match = result.data;
    const notReported = !reportUserService.containsReportedUserID(reportedUsers.results, match.UID);
    const matchTechnicalInterests = match.technicalExperience > menteeMatchProfile.technicalExperience;
    const matchProfessionalExperience = match.professionalExperience > menteeMatchProfile.professionalExperience;
    
    if (notReported && matchTechnicalInterests && matchProfessionalExperience) {
      interestsMatches.push({
        docId: result.docId,
        data: match
      } as DocItem<MatchProfile>);
    }
  });

  if (userProfile.preferences.useLgbtqPlusCommunityForMatching || userProfile.preferences.useRacialIdentityForMatching) {
    // filter based on demographics
    const demographicsMatches = new Array<DocItem<MatchProfile>>();
    for (const result of interestsMatches) {
      const match = result.data;
      const profileResult = await userService.getUserProfile(match.UID);

      const lgbtqMatch = (userProfile.preferences.useLgbtqPlusCommunityForMatching
        && userProfile.demographics.lgbtqPlusCommunity === profileResult.demographics.lgbtqPlusCommunity)
        || !userProfile.preferences.useLgbtqPlusCommunityForMatching;

      const racialIdentityMatch = (userProfile.preferences.useRacialIdentityForMatching
        && userProfile.demographics.racialIdentity === profileResult.demographics.racialIdentity)
        || !userProfile.preferences.useRacialIdentityForMatching;

      if (lgbtqMatch && racialIdentityMatch) {
        demographicsMatches.push({
          docId: result.docId,
          data: match
        } as DocItem<MatchProfile>);
      }
    }

    return demographicsMatches;
  }
  else {
    return interestsMatches;
  }
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
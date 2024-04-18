import { deleteDocId, queryDocId, queryMany, writeSingle } from "./commonDb";
import { MatchProfile } from "../types/matchProfile";
import { DocItem } from "../types/types";
import { where } from "firebase/firestore";
import { ConflictError } from "../types/types";

const collectionName = 'menteeProfile';

async function createMenteeProfileAsync(menteeProfile: MatchProfile) {
  const activeProfiles = (await queryMany<MatchProfile>(collectionName, where('UID', '==', menteeProfile.UID))).results;
  activeProfiles.forEach(profile => {
    if (profile.data.professionalInterest === menteeProfile.professionalInterest &&
      profile.data.technicalInterest === menteeProfile.technicalInterest) {
      throw new ConflictError("a profile with these interests already exists");
    }
  });
  return await writeSingle(collectionName, menteeProfile);
}

async function searchMenteeProfilesByUserAsync(UID: string): Promise<DocItem<MatchProfile>[]> {
  return (await queryMany<MatchProfile>(collectionName, where('UID', '==', UID))).results;
}

async function searchMenteeProfileByIdAsync(menteeProfileId: string): Promise<DocItem<MatchProfile>> {
  return (await queryDocId<MatchProfile>(collectionName, menteeProfileId));
}

async function deleteMenteeProfileByIdAsync(menteeProfileId: string) {
  return (await deleteDocId(collectionName, menteeProfileId));
}

async function deleteMenteeProfileByUIDAsync(uid: string) {

}

const menteeDb = {
  createMenteeProfileAsync,
  searchMenteeProfilesByUserAsync,
  searchMenteeProfileByIdAsync,
  deleteMenteeProfileByIdAsync
}

export default menteeDb;
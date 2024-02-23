import { queryDocId, queryMany, writeSingle } from "./commonDb";
import { MatchProfile } from "../types/matchProfile";
import { DocItem } from "../types/types";
import { where } from "firebase/firestore";

const collectionName = 'menteeProfile';

async function createMenteeProfileAsync(menteeProfile: MatchProfile) {
  return await writeSingle(collectionName, menteeProfile);
}

async function searchMenteeProfilesByUserAsync(UID: string): Promise<DocItem<MatchProfile>[]> {
  return (await queryMany<MatchProfile>(collectionName, where('UID', '==', UID))).results;
}

async function searchMenteeProfileByIdAsync(menteeProfileId: string): Promise<DocItem<MatchProfile>> {
  return (await queryDocId<MatchProfile>(collectionName, menteeProfileId));
}

const menteeDb = {
  createMenteeProfileAsync,
  searchMenteeProfilesByUserAsync,
  searchMenteeProfileByIdAsync
}

export default menteeDb;
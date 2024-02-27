import { UserProfile } from "../types/userProfile";
import { MatchProfile } from "../types/matchProfile";
import mentorDb from "../dal/mentorDb";
import { DocItem } from "../types/types";

async function searchMentorsByProfileMatch(menteeUserProfileId: string, userProfile: UserProfile): Promise<DocItem<MatchProfile>[]> {
  return await mentorDb.searchMentorsByProfileMatchAsync(menteeUserProfileId, userProfile);
}

async function createMentorProfile(mentorProfile: MatchProfile) {
  return await mentorDb.createMentorProfileAsync(mentorProfile);
}

async function editMentorProfile(docId: string, mentorProfile: MatchProfile) {
  return await mentorDb.editMentorProfileAsync(docId, mentorProfile);
}
async function deleteMentorProfile(docID: string) {
  return await mentorDb.deleteMentorProfileAsync(docID);
}

async function searchMentorProfilesByUser(UID: string) {
  return await mentorDb.searchMentorProfilesByUserAsync(UID);
}

export const mentorService = {
  searchMentorsByProfileMatch,
  createMentorProfile,
  editMentorProfile,
  deleteMentorProfile,
  searchMentorProfilesByUser
}
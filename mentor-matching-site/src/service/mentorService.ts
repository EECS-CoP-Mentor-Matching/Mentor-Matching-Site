import { MatchProfile } from "../types/matchProfile";
import mentorDb from "../dal/mentorDb";

// REMOVED: searchMentorsByProfileMatch
// This wrapper function is obsolete - new matching uses matchingService.findMentorMatches()

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
  createMentorProfile,
  editMentorProfile,
  deleteMentorProfile,
  searchMentorProfilesByUser
}

export default mentorService;

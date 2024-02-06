import { UserProfile } from "../types/userProfile";
import { MatchProfile } from "../types/matchProfile";
import mentorDb from "../dal/mentorDb";

async function searchMentorsByProfileMatch(menteeUser: UserProfile, menteeProfile: MatchProfile) {
  return await mentorDb.searchMentorsByProfileMatchAsync(menteeUser, menteeProfile);
}

async function createMentorProfile(mentorProfile: MatchProfile) {
  return await mentorDb.createMentorProfileAsync(mentorProfile);
}

async function searchMentorProfilesByUser(UID: string) {
  return await mentorDb.searchMentorProfilesByUserAsync(UID);
}

export const mentorService = {
  searchMentorsByProfileMatch,
  createMentorProfile,
  searchMentorProfilesByUser
}
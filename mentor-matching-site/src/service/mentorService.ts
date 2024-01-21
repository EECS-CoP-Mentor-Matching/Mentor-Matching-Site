import { MatchProfile, UserProfile } from "../types";
import mentorDb from "../dal/mentorDb";

async function searchMentorsByProfileMatch(menteeUser: UserProfile, menteeProfile: MatchProfile) {
  return await mentorDb.searchMentorsByProfileMatchAsync(menteeUser, menteeProfile);
}

async function createMentorProfile(mentorProfile: MatchProfile) {
  return await mentorDb.createMentorProfileAsync(mentorProfile);
}

export const mentorService = {
  searchMentorsByProfileMatch,
  createMentorProfile
}
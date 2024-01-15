import { MatchProfile, UserProfile } from "../types";
import mentorDb from "../dal/mentorDb";

async function searchMentorsByProfileMatch(menteeUser: UserProfile, menteeProfile: MatchProfile) {
  return await mentorDb.searchMentorsByProfileMatchAsync(menteeUser, menteeProfile);
}

export const mentorService = {
  searchMentorsByProfileMatch
}
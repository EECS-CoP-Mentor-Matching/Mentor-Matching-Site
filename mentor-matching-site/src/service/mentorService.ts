import { MatchProfile, UserProfile } from "../types";
import mentorDb from "../dal/mentorDb";

async function SearchMentorsByProfileMatch(menteeUser: UserProfile, menteeProfile: MatchProfile){
  return await mentorDb.SearchMentorsByProfileMatch(menteeUser, menteeProfile);
}

export const mentorService = {
  SearchMentorsByProfileMatch
}
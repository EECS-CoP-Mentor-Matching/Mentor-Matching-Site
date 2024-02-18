import menteeDb from "../dal/menteeDb";
import { UserProfile } from "../types/userProfile";
import { MatchProfile } from "../types/matchProfile";

/* query for matching mentee to mentor
    if technical interests match
      mentee experience < mentor experience
      if professional interess match
        mentee experience <= mentor experience
        if demographics enabled && match (
          gender identity
          racial identity
          lgbtq+ member
        )*/
async function performMatching(user: UserProfile, menteeProfile: MatchProfile) {
  // Pull stored matches
  // If stored matches have changed / profiles are inactive, remove the match
  // Refresh for new matches
  // check the current user's profiles against existing profiles 
  const mentorProfile = {} as MatchProfile // pull from db
  // 


}

async function createMenteeProfile(menteeProfile: MatchProfile) {
  await menteeDb.createMenteeProfileAsync(menteeProfile);
}

async function searchMenteeProfilesByUser(UID: string) {
  return await menteeDb.searchMenteeProfilesByUserAsync(UID);
}

const menteeService = {
  performMatching,
  createMenteeProfile,
  searchMenteeProfilesByUser
}

export default menteeService;
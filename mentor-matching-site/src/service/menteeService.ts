import menteeDb from "../dal/menteeDb";
import mentorDb from "../dal/mentorDb";
import { MatchProfile, UserProfile } from "../types";

async function readInterests() {
  return await menteeDb.readInterestsAsync();
}

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

const menteeService = {
  readInterests,
  performMatching
}

export default menteeService;
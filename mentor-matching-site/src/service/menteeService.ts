import menteeDb from "../dal/menteeDb";
import { MatchProfile } from "../types/matchProfile";

async function createMenteeProfile(menteeProfile: MatchProfile) {
  await menteeDb.createMenteeProfileAsync(menteeProfile);
}

async function searchMenteeProfilesByUser(UID: string) {
  return await menteeDb.searchMenteeProfilesByUserAsync(UID);
}

async function searchMenteeProfileById(menteeProfileId: string) {
  return await menteeDb.searchMenteeProfileByIdAsync(menteeProfileId);
}

async function deleteMenteeProfileById(menteeProfileId: string) {
  return await menteeDb.deleteMenteeProfileByIdAsync(menteeProfileId);
}

async function getAllMenteeProfiles() {
  return await menteeDb.getAllMenteeProfilesAsync();
}

const menteeService = {
  createMenteeProfile,
  searchMenteeProfilesByUser,
  searchMenteeProfileById,
  deleteMenteeProfileById,
  getAllMenteeProfiles
}

export default menteeService;
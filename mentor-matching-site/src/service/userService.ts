import userDb from "../dal/userDb";
import { UserProfile } from "../types";

async function createNewUser(userProfile: UserProfile) {
  userDb.createNewUserAsync(userProfile);
}

async function getUserProfile(uid: string): Promise<UserProfile> {
  return await userDb.getUserProfileAsync(uid);
}

async function updateUserProfile(uid: string, userProfile: UserProfile) {
  return await userDb.updateUserProfileAsync(uid, userProfile);
}

async function userExists(email: string): Promise<boolean> {
  return await userDb.userExistsAsync(email);
}

const userService = {
  createNewUser,
  getUserProfile,
  updateUserProfile,
  userExists
}

export default userService;
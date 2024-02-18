import { User } from "firebase/auth";
import userDb from "../dal/userDb";
import { UserProfile } from "../types/userProfile";

async function updateProfileImageUrl(uid: string, imageUrl: string) {
  return await userDb.updateUserProfileImage(uid, imageUrl);
}

async function createNewUser(user: User, userProfile: UserProfile) {
  userDb.createNewUserAsync(user, userProfile);
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
  updateProfileImageUrl,
  createNewUser,
  getUserProfile,
  updateUserProfile,
  userExists
}

export default userService;
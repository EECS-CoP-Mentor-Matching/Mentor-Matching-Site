import { User } from "firebase/auth";
import userDb from "../dal/userDb";
import { UserProfile } from "../types/userProfile";

async function updateProfileImageUrl(uid: string, imageUrl: string) {
  return await userDb.updateUserProfileImage(uid, imageUrl);
}

async function createNewUser(user: User, userProfile: UserProfile) {
  await userDb.createNewUserAsync(user, userProfile);
}

async function deleteUserProfile(uid: string) {
  return await userDb.deleteUserProfileAsync(uid).then(() => {
    console.log('User profile deleted successfully.');
  }).catch((error) => {
    console.error('Error deleting user profile:', error);
    throw error;
  });
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

async function getAllUserProfiles(): Promise<UserProfile[]> {
  return await userDb.getAllUserProfilesAsync();
}

async function getAllPendingUsers() {
  return await userDb.getAllPendingUsersAsync();
}

async function deletePendingUser(uid: string) {
  return await userDb.deletePendingUserAsync(uid);
}

const userService = {
  updateProfileImageUrl,
  createNewUser,
  getUserProfile,
  updateUserProfile,
  userExists,
  deleteUserProfile,
  getAllUserProfiles,
  getAllPendingUsers,
  deletePendingUser
}

export default userService;
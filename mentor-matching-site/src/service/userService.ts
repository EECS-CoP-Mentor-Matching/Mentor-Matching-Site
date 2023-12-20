import userDb from "../dal/userDb";
import { UserProfile } from "../types";

async function createNewUser(userProfile: UserProfile) {
  userDb.createNewUser(userProfile);
}

async function getUserProfile(uid: string) {

}

async function updateUserProfile(uid: string, userProfile: UserProfile) {

}

async function userExists(email: string) : Promise<boolean> {
  return await userDb.userExists(email);
}

const userService = {
  createNewUser,
  getUserProfile,
  updateUserProfile,
  userExists
}

export default userService;
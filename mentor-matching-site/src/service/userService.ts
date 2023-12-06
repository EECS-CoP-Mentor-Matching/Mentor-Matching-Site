import { UserProfile } from "../types";

async function createNewUser(userProfile: UserProfile) {

}

async function getUserProfile(uid: string) {

}

async function updateUserProfile(uid: string, userProfile: UserProfile) {

}

const userService = {
  createNewUser,
  getUserProfile,
  updateUserProfile
}

export default userService;
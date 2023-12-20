import { MatchProfile, UserProfile } from "../types";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, QueryConstraint, where, setDoc } from "firebase/firestore";

const collectionName = "userProfile";

async function createNewUser(userProfile: UserProfile) : Promise<boolean> {
  await setDoc(doc(db, collectionName, userProfile.UID), userProfile);
  return true;
}

async function userExists(email: string) : Promise<boolean> {
  const conditions = [];
  conditions.push(where("contact.email", "==", email));
  const users = await search(conditions);
  return users.length !== 0;
}

async function getUserProfile(uid: string) : Promise<UserProfile> {
  const conditions = [];
  conditions.push(where("UID", "==", uid));
  const users = await search(conditions);
  if (users.length === 1) {
    return users[0];
  }
  else {
    throw "More than one result was found for " + uid;
  }  
}

async function search(conditions: any[]) : Promise<UserProfile[]> {
  const userQuery = query(collection(db, collectionName), ...conditions);
  const usersFound = await getDocs(userQuery);
  const users = usersFound.docs.map((doc) => doc.data());
  return users as UserProfile[];
}

const userDb = {
  createNewUser,
  userExists,
  getUserProfile
}

export default userDb;
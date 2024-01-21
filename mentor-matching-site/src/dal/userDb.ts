import { MatchProfile, UserProfile } from "../types";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, QueryConstraint, where, setDoc, updateDoc} from "firebase/firestore";

const collectionName = "userProfile";

async function updateUserProfileAsync(uid: string, userProfile: UserProfile): Promise<void> {
  const userDocRef = doc(db, collectionName, uid);
  await updateDoc(userDocRef, userProfile as { [key: string]: any });
}

async function createNewUserAsync(userProfile: UserProfile): Promise<boolean> {
  await setDoc(doc(db, collectionName, userProfile.UID), userProfile);
  return true;
}

async function userExistsAsync(email: string): Promise<boolean> {
  const conditions = [];
  conditions.push(where("contact.email", "==", email));
  const users = await searchAsync(conditions);
  return users.length !== 0;
}

async function getUserProfileAsync(uid: string): Promise<UserProfile> {
  const conditions = [];
  conditions.push(where("UID", "==", uid));
  const users = await searchAsync(conditions);
  if (users.length === 1) {
    return users[0];
  }
  else {
    throw "More than one result was found for " + uid;
  }
}

async function searchAsync(conditions: any[]): Promise<UserProfile[]> {
  const userQuery = query(collection(db, collectionName), ...conditions);
  const usersFound = await getDocs(userQuery);
  const users = usersFound.docs.map((doc) => doc.data());
  return users as UserProfile[];
}

const userDb = {
  createNewUserAsync,
  userExistsAsync,
  getUserProfileAsync,
  updateUserProfileAsync
}

export default userDb;
import { MatchProfile, UserProfile } from "../types";
import { db } from "../firebaseConfig";
import { collection, getDocs, doc, getDoc, query, QueryConstraint, where, setDoc } from "firebase/firestore";

async function createNewUser(userProfile: UserProfile) : Promise<boolean> {
  await setDoc(doc(db, "userProfile", userProfile.UID), userProfile);
  return true;
}

async function userExists(email: string) : Promise<boolean> {
  const conditions = []
  conditions.push(where("contact.email", "==", email));
  
  console.log(email);

  const userQuery = query(collection(db, "userProfile"), ...conditions);
  const usersFound = await getDocs(userQuery);

  const users = usersFound.docs.map((doc) => doc.data());

  console.log(users);

  return users.length !== 0;
}

const userDb = {
  createNewUser,
  userExists
}

export default userDb;
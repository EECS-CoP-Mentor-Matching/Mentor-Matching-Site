import { MatchHistoryItem, UserAccountSettings, UserProfile } from "../types/userProfile";
import { app, db } from "../firebaseConfig";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { User } from "firebase/auth";

const collectionName = "userProfile";

async function updateUserProfileImage(uid: string, imageUrl: string) {
  const userRef = doc(db, 'userProfile', uid); // Replace 'users' with actual collection name
  await setDoc(userRef, { imageUrl }, { merge: true });
  return true;
}

async function updateUserProfileAsync(uid: string, userProfile: UserProfile): Promise<void> {
  const userDocRef = doc(db, collectionName, uid);
  await updateDoc(userDocRef, userProfile as { [key: string]: any });
}

async function createNewUserAsync(user: User, userProfile: UserProfile): Promise<boolean> {
  const initialUserProfile = {
    UID: user.uid,
    contact: userProfile.contact,
    personal: userProfile.personal,
    demographics: userProfile.demographics,
    education: userProfile.education,
    accountSettings: {
      userStatus: "active",
      menteePortalEnabled: userProfile.accountSettings.menteePortalEnabled,
      mentorPortalEnabled: userProfile.accountSettings.mentorPortalEnabled,
    } as UserAccountSettings,
    matchHistory: Array<MatchHistoryItem>(),
    profilePictureUrl: userProfile.profilePictureUrl,
    preferences: userProfile.preferences
  } as UserProfile;
  await setDoc(doc(db, collectionName, user.uid), initialUserProfile);
  return true;
}

async function deleteUserProfileAsync(uid: string) {
  const db = getFirestore(app);
  const userDocRef = doc(db, "users", uid);
  const matchHistoryCollection = collection(db, `users/${uid}/matchHistory`);
  const messagesCollection = collection(db, `users/${uid}/messages`);
  const reportsCollection = collection(db, "reports");

  // Delete user document
  await deleteDoc(userDocRef);

  // Delete user match history
  const matchHistorySnapshot = await getDocs(matchHistoryCollection);
  matchHistorySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  // Delete user messages
  const messagesSnapshot = await getDocs(messagesCollection);
  messagesSnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });

  // Preserve reports and block data
  const reportsSnapshot = await getDocs(reportsCollection);
  reportsSnapshot.forEach(async (reportDoc) => {
    const reportData = reportDoc.data();
    if (reportData.userUID === uid) {
      // Modify the report to anonymize user data or mark it as deleted
      await updateDoc(reportDoc.ref, { userUID: "deleted", userData: null });
    }
  });

  // Delete user from authentication
  // const auth = getAuth();
  // const user = await auth.getUser(uid);
  // await deleteUser(user);

  console.log(`UserProfile with UID ${uid} and related data deleted successfully.`);
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
  if (users.length >= 1) {
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

async function deleteUserProfile(uid: string): Promise<any> {

}

const userDb = {
  updateUserProfileImage,
  createNewUserAsync,
  userExistsAsync,
  getUserProfileAsync,
  updateUserProfileAsync,
  deleteUserProfileAsync
}

export default userDb;
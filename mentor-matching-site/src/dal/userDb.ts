import { queryMany } from "./commonDb";
import { MatchHistoryItem, UserAccountSettings, UserProfile } from "../types/userProfile";
import { app, db } from "../firebaseConfig";
import { collection, getDocs, doc, query, where, setDoc, updateDoc, deleteDoc, getFirestore } from "firebase/firestore";
import { deleteUser, getAuth, User } from "firebase/auth";


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
  try {
    const { contact, personal, demographics,
      education, accountSettings,
      profilePictureUrl, preferences } = userProfile;

    const initialUserProfile: UserProfile = {
      UID: user.uid,
      contact,
      personal,
      demographics,
      education,
      accountSettings: {
        userStatus: "active",
        menteePortalEnabled: accountSettings.menteePortalEnabled,
        mentorPortalEnabled: accountSettings.mentorPortalEnabled,
      },
      matchHistory: [],
      profilePictureUrl,
      preferences
    };

    await setDoc(doc(db, collectionName, user.uid), initialUserProfile);
    return true;
  } catch (error) {
    console.error("Error creating new user:", error);
    return false;
  }
}

async function deleteUserProfileAsync(uid: string) {
  const db = getFirestore(app);
  const userDocRef = doc(db, "userProfile", uid);
  const matchHistoryCollection = collection(db, `users/${uid}/matchHistory`);
  const messagesCollection = collection(db, `users/${uid}/messages`);
  const reportsCollection = collection(db, "reports");

  // Save the user's profile just in case we want to restore it later:
  const userProfile = await getUserProfileAsync(uid);
  if (userProfile) {
    await setDoc(doc(db, "userProfileRestore", uid), userProfile)
  }

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
  // TODO: This works for now; but CoPilot suggested that we may not want to delete the currently signed in user (i.e. if we are logged in as an admin account)
  const auth = getAuth();
  const user = await auth.currentUser;
  if (user)
  {
    await deleteUser(user);
  }
  else
  {
    console.log("Error deleting user auth")
  }

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
  return {} as UserProfile;
}

async function searchAsync(conditions: any[]): Promise<UserProfile[]> {
  const userQuery = query(collection(db, collectionName), ...conditions);
  const usersFound = await getDocs(userQuery);
  const users = usersFound.docs.map((doc) => doc.data());
  return users as UserProfile[];
}

async function getAllUserProfilesAsync(): Promise<UserProfile[]> {
  const results = await queryMany<UserProfile>(collectionName);
  return results.results.map((doc) => doc.data as UserProfile);
}

// Get a list of all pending users in our database:
async function getAllPendingUsersAsync() {
  const results = await queryMany("pendingUsers");
  return results.results.map((doc) => doc.data);
}

const userDb = {
  updateUserProfileImage,
  createNewUserAsync,
  userExistsAsync,
  getUserProfileAsync,
  updateUserProfileAsync,
  deleteUserProfileAsync,
  getAllUserProfilesAsync,
  getAllPendingUsersAsync
}

export default userDb;
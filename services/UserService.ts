// This service handles interactions with the user profiles in Firestore:

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile } from '../types';
import { app } from '../firebaseConfig';

const db = getFirestore(app);

const userService = {
  async createNewUser(userProfile: UserProfile) {
    const userRef = doc(db, 'userProfiles', userProfile.UID);
    await setDoc(userRef, userProfile);
  },

  async getUserProfile(userId: string): Promise<UserProfile | undefined> {
    const docRef = doc(db, 'userProfiles', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? (docSnap.data() as UserProfile) : undefined;
  },

  async updateUserProfile(userId: string, profileData: UserProfile) {
    const userRef = doc(db, 'userProfiles', userId);
    await setDoc(userRef, profileData, { merge: true });
  },
};

export default userService;

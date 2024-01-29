import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as serviceAccount from "./firebaseConfig.json";
import { getStorage } from 'firebase/storage';

export const app = initializeApp(serviceAccount);
export const db = getFirestore(app);
export const storage = getStorage(app);

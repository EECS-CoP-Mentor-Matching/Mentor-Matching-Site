import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import * as serviceAccount from "./firebaseConfig.json";

export const app = initializeApp(serviceAccount);
export const db = getFirestore(app);
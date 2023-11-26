import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import * as serviceAccount from "../eecs-cop-mentor-matching-dev-firebase-adminsdk-6ubjv-63c8523b3d.json";

const app = initializeApp(serviceAccount);
export const db = getFirestore(app);
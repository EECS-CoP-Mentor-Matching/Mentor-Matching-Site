import * as admin from "firebase-admin"

const serviceAccount = "../../eecs-cop-mentor-matching-dev-firebase-adminsdk-6ubjv-63c8523b3d.json";

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const db = admin.firestore();
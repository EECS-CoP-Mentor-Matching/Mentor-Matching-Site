import { DbWriteResult, UserReport } from "../types/types";
import { writeSingle } from "./commonDb";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";

async function reportUserAsync(userReport: UserReport): Promise<DbWriteResult> {
  const newReport = {
    ...userReport,
    timestamp: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "userReports"), newReport);
  return {
    success: true,
    message: 'Document successfully written!',
    docId: docRef.id,
  };
}

async function getAllReports(): Promise<UserReport[]> {
  const querySnapshot = await getDocs(collection(db, "userReports"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data() as UserReport;
    return { ...data, id: doc.id };
  });
}

export const reportUserDb = {
  reportUserAsync,
  getAllReports
}
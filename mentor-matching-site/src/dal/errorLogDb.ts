import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { ErrorLog } from "../types/types";

async function writeErrorLog(component: string, errorMessage: string) {
  try {
    const log = {
      component: component,
      errorMessage: errorMessage
    } as ErrorLog

    const doc = await addDoc(collection(db, "errorLogs"), log);
    return { success: true, id: doc.id };
  } catch (error) {
    return { success: false, error: error };
  }
}

export const errorLogDb = {
  writeErrorLog
}
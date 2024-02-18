import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DbResult } from "../types/types";
import { errorLogDb } from "./errorLogDb";

async function writeSingle(data: any, collectionName: string): Promise<DbResult> {
  try {
    const doc = await addDoc(collection(db, collectionName), data);
    return {
      data: doc.id,
      success: true,
      message: 'Record successfully added'
    } as DbResult;
  }
  catch (error) {
    return await writeError(collectionName, error);
  }
}

async function writeMany(data: Array<any>, collectionName: string): Promise<DbResult> {
  try {
    const batch = writeBatch(db);
    data.forEach(item => {
      const itemRef = doc(db, collectionName);
      batch.set(itemRef, item)
    });
    await batch.commit();
    return {
      success: true,
      message: 'Records successfully added'
    } as DbResult;
  }
  catch (error) {
    return await writeError(collectionName, error);
  }
}

const writeError = async (component: string, error: any): Promise<DbResult> => {
  let errorMessage = 'Unknown error';
  if (error instanceof Error) errorMessage = error.message;
  errorLogDb.writeErrorLog(component, errorMessage);

  return {
    success: false,
    message: errorMessage
  } as DbResult;
}

export const commonDb = {
  writeSingle,
  writeMany
}
import { addDoc, collection, doc, writeBatch, where, query, QueryConstraint, getDoc, getDocs, QuerySnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DbReadResult, DbUpdateResult, DbWriteResult } from "../types/types";
import { errorLogDb } from "./errorLogDb";

// Write Logic
async function writeSingle(collectionName: string, data: any): Promise<DbWriteResult> {
  try {
    const doc = await addDoc(collection(db, collectionName), data);
    return {
      data: doc.id,
      success: true,
      message: 'Record successfully added'
    } as DbWriteResult;
  }
  catch (error) {
    return await logWriteError(collectionName, error);
  }
}

async function writeMany(collectionName: string, data: Array<any>): Promise<DbWriteResult> {
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
    } as DbWriteResult;
  }
  catch (error) {
    return await logWriteError(collectionName, error);
  }
}

async function logWriteError(component: string, error: any): Promise<DbWriteResult> {
  const errorMessage = await logError(component, error);

  return {
    success: false,
    message: errorMessage
  } as DbWriteResult;
}

// Update Logic
async function updateSingle(collectionName: string, docId: string, updateValue: any) {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, updateValue);

    return {
      success: true,
      message: `${docId} updated successfully`,
      docId: docId
    } as DbUpdateResult
  }
  catch (error) {
    return await logUpdateError(collectionName, docId, error);
  }
}

async function logUpdateError(component: string, docId: string, error: any) {
  const errorMessage = await logError(component, error);

  return {
    success: false,
    message: errorMessage,
    docId: docId
  } as DbUpdateResult;
}

// Read Logic
export interface QueryItem {
  param: string,
  operator: '<' | '<=' | '==' | '>' | '>=' | '!=' | 'in' | 'not-in' | 'array-contains-any' | 'array-contains',
  queryValue: any
}

async function readSingle<T>(collectionName: string, queryParameters: QueryItem[]): Promise<DbReadResult<T>> {
  try {
    const records = await readCommon(collectionName, queryParameters);
    if (records.empty || records.size === 0) { throw new Error('no records found'); }
    if (records.size > 1) { throw new Error('too many records found'); }
    const tRecord = records.docs.map((doc) => doc.data())[0] as T;

    return {
      success: true,
      message: 'record found',
      data: tRecord
    } as DbReadResult<T>;
  }
  catch (error) {
    return await logReadError(collectionName, error);
  }
}

async function readMany<T>(collectionName: string, queryParameters: QueryItem[]): Promise<DbReadResult<T>> {
  try {
    const records = await readCommon(collectionName, queryParameters);
    if (records.empty || records.size === 0) { throw new Error('no records found'); }
    const tRecords = records.docs.map((doc) => doc.data());

    return {
      success: true,
      message: 'records found',
      data: tRecords
    } as DbReadResult<T>;
  }
  catch (error) {
    return await logReadError(collectionName, error);
  }
}

async function readCommon(collectionName: string, queryParameters: QueryItem[]): Promise<QuerySnapshot> {
  const conditions = new Array<QueryConstraint>;
  queryParameters.forEach(param => {
    conditions.push(where(param.param, param.operator, param.queryValue));
  });
  const readQuery = query(collection(db, collectionName), ...conditions);
  const records = await getDocs(readQuery);
  return records;
}

async function logReadError<T>(component: string, error: any): Promise<DbReadResult<T>> {
  const errorMessage = await logError(component, error);

  return {
    success: false,
    message: errorMessage
  } as DbReadResult<T>;
}

// Common Methods
async function logError(component: string, error: any): Promise<string> {
  let errorMessage = 'Unknown error';
  if (error instanceof Error) errorMessage = error.message;
  errorLogDb.writeErrorLog(component, errorMessage);
  return errorMessage;
}

export const commonDb = {
  writeSingle,
  writeMany,
  updateSingle,
  readSingle,
  readMany
}
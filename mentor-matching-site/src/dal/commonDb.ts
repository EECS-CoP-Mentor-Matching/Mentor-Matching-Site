import { addDoc, collection, doc, writeBatch, query, QueryConstraint, getDocs, QuerySnapshot, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DocItem, DbReadResult, DbReadResults, DbUpdateResult, DbWriteResult } from "../types/types";

// Write Logic
export async function writeSingle(collectionName: string, data: any): Promise<DbWriteResult> {
  const doc = await addDoc(collection(db, collectionName), data);
  return {
    docId: doc.id,
    success: true,
    message: 'Record successfully added'
  } as DbWriteResult;
}

export async function writeMany(collectionName: string, data: Array<any>): Promise<DbWriteResult> {
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

// Update Logic
export async function updateSingle(collectionName: string, docId: string, updateValue: any) {
  const docRef = doc(db, collectionName, docId);
  await updateDoc(docRef, updateValue);

  return {
    success: true,
    message: `${docId} updated successfully`,
    docId: docId
  } as DbUpdateResult
}

// Read
export async function readSingle<T>(collectionName: string): Promise<DbReadResult<T>> {
  const records = await readCommon(collectionName);
  return processSingleReadResults(records);
}

export async function readMany<T>(collectionName: string): Promise<DbReadResults<T>> {
  const records = await readCommon(collectionName);
  return processManyReadResults(records);
}

async function readCommon(collectionName: string): Promise<QuerySnapshot> {
  const readQuery = query(collection(db, collectionName));
  const records = await getDocs(readQuery);
  return records;
}

// Query
export async function querySingle<T>(collectionName: string, ...conditions: QueryConstraint[]): Promise<DbReadResult<T>> {
  const records = await queryCommon(collectionName, ...conditions);
  return processSingleReadResults(records);
}

export async function queryMany<T>(collectionName: string, ...conditions: QueryConstraint[]): Promise<DbReadResults<T>> {
  const records = await queryCommon(collectionName, ...conditions);
  return processManyReadResults(records);
}

async function queryCommon(collectionName: string, ...conditions: QueryConstraint[]): Promise<QuerySnapshot> {
  const readQuery = query(collection(db, collectionName), ...conditions);
  const records = await getDocs(readQuery);
  return records;
}

function processSingleReadResults<T>(records: QuerySnapshot) {
  if (records.empty || records.size === 0) { throw new Error('no records found'); }
  if (records.size > 1) { throw new Error('too many records found'); }

  const results = records.docs.map((doc) => {
    return {
      success: true,
      message: 'record found',
      data: doc.data(),
      docId: doc.id
    } as DbReadResult<T>;
  });

  return results[0];
}

function processManyReadResults<T>(records: QuerySnapshot) {
  if (records.empty || records.size === 0) { throw new Error('no records found'); }

  const results = records.docs.map((doc) => {
    return {
      data: doc.data(),
      docId: doc.id
    } as DocItem<T>;
  });

  return {
    success: true,
    message: 'record found',
    results: results
  } as DbReadResults<T>;
}
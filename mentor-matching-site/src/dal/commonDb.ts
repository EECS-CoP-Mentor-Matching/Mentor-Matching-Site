import { addDoc, collection, doc, writeBatch, query, QueryConstraint, getDocs, QuerySnapshot, updateDoc, getDoc, deleteDoc, where, CollectionReference, Query, DocumentReference } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { DocItem, DbReadResult, DbReadResults, DbUpdateResult, DbWriteResult, DbDeleteResult } from "../types/types";

// Helper functions to allow for collection references to be passed into 
function ensureCollectionRef(collectionName: string | CollectionReference): CollectionReference {
  return typeof collectionName === "string" ? collection(db, collectionName) : collectionName;
}

function ensureDocRef(collectionName: string | CollectionReference, docId: string): DocumentReference {
  return typeof collectionName === "string" ? doc(db, collectionName, docId) : doc(collectionName, docId)
}

// Write Logic
export async function writeSingle(collectionName: string | CollectionReference, data: any): Promise<DbWriteResult> {
  const ref = ensureCollectionRef(collectionName);
  const doc = await addDoc(ref, data);
  return {
    docId: doc.id,
    success: true,
    message: 'Record successfully added'
  } as DbWriteResult;
}

export async function writeMany(collectionName: string | CollectionReference, data: Array<any>): Promise<DbWriteResult> {
  const batch = writeBatch(db);
  const ref = ensureCollectionRef(collectionName);
  data.forEach(item => {
    const itemRef = doc(ref);
    batch.set(itemRef, item)
  });
  await batch.commit();
  return {
    success: true,
    message: 'Records successfully added'
  } as DbWriteResult;
}

// Update Logic
export async function updateSingle(collectionName: string | CollectionReference, docId: string, updateValue: any) {
  const docRef = ensureDocRef(collectionName, docId);
  await updateDoc(docRef, updateValue);

  return {
    success: true,
    message: `${docId} updated successfully`,
    docId: docId
  } as DbUpdateResult
}

// Read
export async function readSingle<T>(collectionName: string | CollectionReference): Promise<DbReadResult<T>> {
  const records = await readCommon(collectionName);
  return processSingleReadResults(records);
}

export async function readMany<T>(collectionName: string | CollectionReference): Promise<DbReadResults<T>> {
  const records = await readCommon(collectionName);
  return processManyReadResults(records);
}

async function readCommon(collectionName: string | CollectionReference): Promise<QuerySnapshot> {
  const ref = ensureCollectionRef(collectionName);
  const readQuery = query(ref);
  const records = await getDocs(readQuery);
  return records;
}

export async function queryDocId<T>(collectionName: string | CollectionReference, docId: string): Promise<DbReadResult<T>> {
  const ref = ensureDocRef(collectionName, docId);
  const docSnap = await getDoc(ref);

  return {
    success: true,
    message: 'record found',
    data: docSnap.data(),
    docId: docSnap.id
  } as DbReadResult<T>;
}

// Query
export async function querySingle<T>(collectionName: string | CollectionReference, ...conditions: QueryConstraint[]): Promise<DbReadResult<T>> {
  const records = await queryCommon(collectionName, ...conditions);
  return processSingleReadResults(records);
}

export async function queryMany<T>(collectionName: string | CollectionReference, ...conditions: QueryConstraint[]): Promise<DbReadResults<T>> {
  const records = await queryCommon(collectionName, ...conditions);
  return processManyReadResults(records);
}

async function queryCommon(collectionName: string | CollectionReference, ...conditions: QueryConstraint[]): Promise<QuerySnapshot> {
  const ref = ensureCollectionRef(collectionName);
  const readQuery = query((ref), ...conditions);
  const records = await getDocs(readQuery);
  return records;
}

function processSingleReadResults<T>(records: QuerySnapshot) {
  // if (records.empty || records.size === 0) { throw new Error('no records found'); }
  // if (records.size > 1) { throw new Error('too many records found'); }

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
  // if (records.empty || records.size === 0) { throw new Error('no records found'); }

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

export async function deleteDocId(collectionName: string | CollectionReference, docId: string): Promise<DbDeleteResult> {
  const docRef = ensureDocRef(collectionName, docId);
  await deleteDoc(docRef);

  return {
    success: true,
    message: 'record deleted',
    docId: docId
  } as DbDeleteResult;
}
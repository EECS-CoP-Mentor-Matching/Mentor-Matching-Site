import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EducationLevel } from "../types/matchProfile";
import { RacialIdentity, TimeZone } from "../types/userProfile";
import { readMany } from "./commonDb";
import { DocItem } from "../types/types";

async function educationLevelsAsync(): Promise<DocItem<EducationLevel>[]> {
  return (await readMany<EducationLevel>('educationLevels')).results;
}

async function racialIdentitiesAsync(): Promise<RacialIdentity[]> {
  const racialIdentities = await searchDbAsync<RacialIdentity>("racialIdentities");
  return racialIdentities;
}

async function timeZonesAsync(): Promise<TimeZone[]> {
  const timeZones = await searchDbAsync<TimeZone>("timeZones");
  return timeZones;
}

async function degreeProgramsAsync(): Promise<TimeZone[]> {
  const degreePrograms = await searchDbAsync<TimeZone>("degreePrograms");
  return degreePrograms;
}

async function searchDbAsync<T>(collectionName: string): Promise<T[]> {
  const matchQuery = collection(db, collectionName);
  const matches = await getDocs(matchQuery)
  const dbResults = matches.docs.map((doc) => doc.data());
  return dbResults as Array<T>;
}

const selectionItemsDb = {
  educationLevelsAsync,
  racialIdentitiesAsync,
  timeZonesAsync,
  degreeProgramsAsync
}

export default selectionItemsDb;
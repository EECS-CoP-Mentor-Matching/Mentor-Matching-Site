import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EducationLevel } from "../types/matchProfile";
import { RacialIdentity, TimeZone } from "../types/userProfile";

async function educationLevelsAsync(): Promise<EducationLevel[]> {
  const educationLevels = await searchDbAsync<EducationLevel>("educationLevels");
  return educationLevels;
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
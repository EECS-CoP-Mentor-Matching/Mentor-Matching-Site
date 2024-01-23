import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { EducationLevel } from "../types";

async function educationLevelsAsync(): Promise<EducationLevel[]> {
  const matchQuery = collection(db, "educationLevels");
  const matches = await getDocs(matchQuery)
  const dbResults = matches.docs.map((doc) => doc.data());
  const educationLevels = dbResults as EducationLevel[];
  console.log("educationLevels", educationLevels)
  return educationLevels;
}

const selectionItemsDb = {
  educationLevelsAsync
}

export default selectionItemsDb;
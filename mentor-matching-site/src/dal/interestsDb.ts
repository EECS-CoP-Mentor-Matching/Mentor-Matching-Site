import {collection, getDocs, query} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {ExperienceLevel, ProfessionalInterest, TechnicalInterest} from "../types/matchProfile";

async function searchTechnicalInterests() : Promise<TechnicalInterest[]> {
  let matchQuery = query(collection(db, "technicalInterests"));

  const matches = await getDocs(matchQuery);
  return matches.docs.map((doc) => ({ id: doc.id, ...doc.data() as TechnicalInterest }));
}

async function searchProfessionalInterests() : Promise<ProfessionalInterest[]> {
  let matchQuery = query(collection(db, "professionalInterests"));

  const matches = await getDocs(matchQuery);
  return matches.docs.map((doc) => ({ id: doc.id, ...doc.data() as ProfessionalInterest }));
}


async function searchExperienceLevels() : Promise<ExperienceLevel[]> {
  let matchQuery = query(collection(db, "experienceLevels"));

  const matches = await getDocs(matchQuery);
  return matches.docs.map((doc) => ({ id: doc.id, ...doc.data() as ExperienceLevel }));
}

const interestsDb = {
  searchTechnicalInterests,
  searchProfessionalInterests,
  searchExperienceLevels
};

export default interestsDb;
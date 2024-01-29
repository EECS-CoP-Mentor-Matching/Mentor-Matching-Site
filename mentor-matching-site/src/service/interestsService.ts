import interestsDb from "../dal/interestsDb";
import {ExperienceLevel, ProfessionalInterest, TechnicalInterest} from "../types/matchProfile";

async function getTechnicalInterests() : Promise<TechnicalInterest[]> {
  return await interestsDb.searchTechnicalInterests();
}

async function getProfessionalInterests() : Promise<ProfessionalInterest[]> {
  return await interestsDb.searchProfessionalInterests();
}

async function getExperienceLevels() : Promise<ExperienceLevel[]> {
  return await interestsDb.searchExperienceLevels();
}

export const interestsService = {
  getTechnicalInterests,
  getProfessionalInterests,
  getExperienceLevels
}
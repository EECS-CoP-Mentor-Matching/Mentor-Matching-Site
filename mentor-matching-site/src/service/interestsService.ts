import interestsDb from "../dal/interestsDb";
import { ExperienceLevel, ProfessionalInterest, TechnicalInterest } from "../types/matchProfile";
import { DocItem } from "../types/types";

async function getTechnicalInterests(): Promise<DocItem<TechnicalInterest>[]> {
  return await interestsDb.searchTechnicalInterests();
}

async function getProfessionalInterests(): Promise<DocItem<ProfessionalInterest>[]> {
  return await interestsDb.searchProfessionalInterests();
}

async function getExperienceLevels(): Promise<DocItem<ExperienceLevel>[]> {
  return await interestsDb.searchExperienceLevels();
}

export const interestsService = {
  getTechnicalInterests,
  getProfessionalInterests,
  getExperienceLevels
}
import { ExperienceLevel, ProfessionalInterest, TechnicalInterest } from "../types/matchProfile";
import { DocItem } from "../types/types";
import { readMany } from "./commonDb";

async function searchTechnicalInterests(): Promise<DocItem<TechnicalInterest>[]> {
  return (await readMany<TechnicalInterest>('technicalInterests')).results;
}

async function searchProfessionalInterests(): Promise<DocItem<ProfessionalInterest>[]> {
  return (await readMany<ProfessionalInterest>('professionalInterests')).results;
}

async function searchExperienceLevels(): Promise<DocItem<ExperienceLevel>[]> {
  return (await readMany<ExperienceLevel>('experienceLevels')).results;
}

const interestsDb = {
  searchTechnicalInterests,
  searchProfessionalInterests,
  searchExperienceLevels
};

export default interestsDb;
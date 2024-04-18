import { EducationLevel } from "../types/matchProfile";
import { DegreeProgram, RacialIdentity, TimeZone } from "../types/userProfile";
import { readMany } from "./commonDb";
import { DocItem } from "../types/types";

async function educationLevelsAsync(): Promise<DocItem<EducationLevel>[]> {
  return (await readMany<EducationLevel>('educationLevels')).results;
}

async function racialIdentitiesAsync(): Promise<DocItem<RacialIdentity>[]> {
  return (await readMany<RacialIdentity>('racialIdentities')).results;
}

async function timeZonesAsync(): Promise<DocItem<TimeZone>[]> {
  return (await readMany<TimeZone>('timeZones')).results;
}

async function degreeProgramsAsync(): Promise<DocItem<DegreeProgram>[]> {
  return (await readMany<DegreeProgram>('degreePrograms')).results;
}

const selectionItemsDb = {
  educationLevelsAsync,
  racialIdentitiesAsync,
  timeZonesAsync,
  degreeProgramsAsync
}

export default selectionItemsDb;
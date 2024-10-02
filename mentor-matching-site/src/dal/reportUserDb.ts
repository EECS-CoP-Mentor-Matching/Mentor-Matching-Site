import { where } from "firebase/firestore";
import { DbReadResult, DbWriteResult, DocItem, UserReport } from "../types/types";
import { queryMany, writeSingle } from "./commonDb";

const collection = "userReports";

async function reportUserAsync(userReport: UserReport): Promise<DbWriteResult> {
  return await writeSingle(collection, userReport);
}

async function getUserReportsAsync(menteeUID: string) : Promise<DocItem<UserReport>[]> {
  const reportedUsersConditions = [];
  reportedUsersConditions.push(where("reportedByUID", "==", menteeUID));
  return (await queryMany<UserReport>(collection, ...reportedUsersConditions)).results;
}

export const reportUserDb = {
  reportUserAsync,
  getUserReportsAsync
}
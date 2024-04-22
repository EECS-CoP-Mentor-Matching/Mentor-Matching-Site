import { DbWriteResult, UserReport } from "../types/types";
import { writeSingle } from "./commonDb";

const collection = "userReports";

async function reportUserAsync(userReport: UserReport): Promise<DbWriteResult> {
  return await writeSingle(collection, userReport);
}

export const reportUserDb = {
  reportUserAsync
}
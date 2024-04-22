import { reportUserDb } from "../dal/reportUserDb";
import { UserReport } from "../types/types";


async function reportUser(userReport: UserReport) {
  return await reportUserDb.reportUserAsync(userReport);
}

export const reportUserService = {
  reportUser
}
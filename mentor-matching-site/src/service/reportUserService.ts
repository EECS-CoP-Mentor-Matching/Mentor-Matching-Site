import { reportUserDb } from "../dal/reportUserDb";
import { DocItem, UserReport } from "../types/types";


async function reportUser(userReport: UserReport) {
  return await reportUserDb.reportUserAsync(userReport);
}

async function getUserReports(menteeUID: string) : Promise<DocItem<UserReport>[]> {
  return (await reportUserDb.getUserReportsAsync(menteeUID));
}

const containsReportedUserID = (usersReported: DocItem<UserReport>[], mentorUID: string) : boolean => {
  let reported = false;
  usersReported.forEach(user => {
    if (user.data.reportedForUID === mentorUID) {
      reported = true;
    }
  });
  return reported;
}

export const reportUserService = {
  reportUser,
  getUserReports,
  containsReportedUserID
}
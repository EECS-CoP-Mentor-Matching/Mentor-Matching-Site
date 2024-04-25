import { reportUserDb } from "../dal/reportUserDb";
import { UserReport } from "../types/types";
import { doc, deleteDoc } from "firebase/firestore"; // Import deleteDoc from firebase/firestore
import { db } from "../firebaseConfig"; // Import db from firebaseConfig

async function reportUser(userReport: UserReport) {
  return await reportUserDb.reportUserAsync(userReport);
}

async function getAllReports() {
  return await reportUserDb.getAllReports();
}

async function deleteReportEntry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "userReports", id));
  } catch (error) {
    console.error("Error deleting report entry:", error);
    throw error;
  }
}

export const reportUserService = {
  reportUser,
  getAllReports,
  deleteReportEntry,
};
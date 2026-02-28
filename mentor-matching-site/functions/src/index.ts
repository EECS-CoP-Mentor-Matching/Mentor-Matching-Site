/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import { onCall } from "firebase-functions/v2/https";
import * as adminFunctions from "firebase-admin";

adminFunctions.initializeApp();

// Function for approving a user who does not have an OSU email address:
export const approvePendingUser = onCall(async (request) => {
  const userData = request.data;

  if (!request.auth) {
    throw new Error("You are not signed in.  Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new Error("This function can be run by authorized Mentor Match Admins only.");
  }

  const uid = userData.uid;
  if (!uid) {
    throw new Error("User ID (UID) not provided.");
  }

  await adminFunctions.auth().setCustomUserClaims(uid, { allowed: true });
  await adminFunctions.firestore().doc(`pendingUsers/${uid}`).delete();

  return { success: true };
});

// Function for granting a user Firebase admin privileges.
// TODO: we will want to set this up as part of making a user an admin.

export const setAdminPrivileges = onCall(async (request) => {
  const uid = request.data.uid;
  await adminFunctions.auth().setCustomUserClaims(uid, { admin: true });
  return { success: true };
});
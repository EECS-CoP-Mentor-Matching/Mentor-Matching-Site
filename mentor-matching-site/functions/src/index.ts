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
// Checks tha user sending request is admin, and sets new_admin_uid to admin
export const setAdminPrivileges = onCall(async (request) => {
  const uid = request.data.uid;
  const new_admin_uid = request.data.new_admin_uid;

  if (!request.auth) {
    throw new Error("You are not signed in.  Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new Error("This function can be run by authorized Mentor Match Admins only.");
  }

  if (!uid) {
    throw new Error("User ID (UID) not provided.");
  }

  if (!new_admin_uid) {
    throw new Error("New Admin User ID (UID) not provided.");
  }

  await adminFunctions.auth().setCustomUserClaims(new_admin_uid, { admin: true });
  return { success: true };
});

// Function for deleting a user's Firebase Authentication record.
// Can only be called by an authenticated admin.
// Deletes the auth record for the target UID — the Firestore profile
// should be deleted separately via userService.deleteUserProfile().
export const deleteUserAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("You are not signed in.  Please sign in first.");
  }

  // Verify the calling user is an admin by checking their Firestore role
  const callerProfile = await adminFunctions.firestore()
    .doc(`userProfile/${request.auth.uid}`)
    .get();

  if (!callerProfile.exists) {
    throw new Error("Caller profile not found.");
  }

  if (request.auth.token.admin !== true) {
    throw new Error("This function can be run by authorized Mentor Match Admins only.");
  }

  const uid = request.data.uid;
  if (!uid) {
    throw new Error("User ID (UID) not provided.");
  }

  await adminFunctions.auth().deleteUser(uid);

  return { success: true };
});

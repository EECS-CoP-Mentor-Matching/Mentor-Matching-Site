import { onCall } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as adminFunctions from "firebase-admin";

adminFunctions.initializeApp();

const SITE_URL = "https://eecscopmentormatch.com";

// ── Helper: send email via Trigger Email extension ──────────────────────────
async function sendMail(to: string, subject: string, text: string) {
  await adminFunctions.firestore().collection("mail").add({
    to,
    message: { subject, text },
  });
}

// ── Helper: get all admin emails ─────────────────────────────────────────────
async function getAdminEmails(): Promise<string[]> {
  const snapshot = await adminFunctions.firestore()
    .collection("userProfile")
    .where("preferences.role", "==", "Admin")
    .get();
  const emails: string[] = [];
  snapshot.forEach((doc) => {
    const email = doc.data()?.contact?.email;
    if (email) emails.push(email);
  });
  return emails;
}

// ── Firestore trigger: notify admins when a non-OSU user requests access ─────
export const notifyAdminsOnPendingUser = onDocumentCreated(
  "pendingUsers/{uid}",
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const userEmail = data.email ?? "Unknown";
    const adminEmails = await getAdminEmails();

    await Promise.all(
      adminEmails.map((adminEmail) =>
        sendMail(
          adminEmail,
          "New Non-OSU Account Request — Mentor Match",
          `A new non-OSU user has requested access to Mentor Match.\n\nEmail: ${userEmail}\n\nPlease review and approve or deny their request at:\n${SITE_URL}/admin-portal/pending-users\n\nThe EECS Mentor Match Team`
        )
      )
    );
  }
);

// ── Firestore trigger: create test match for tester mentors ─────────────────
// Fires when a mentor matching profile is created
// Only creates a test match if the mentor was invited as a tester (isTester claim)
const MATCHY_MATCHERSON_UID = "DemoMentee1";
const MATCHY_MATCHERSON_PROFILE_ID = "IotpXSPnuQzUU1G9j4BX";

export const createTestMatchOnProfileCreated = onDocumentCreated(
  "mentorProfile/{profileId}",
  async (event) => {
    const profileData = event.data?.data();
    if (!profileData) return;

    const uid = profileData.UID;
    if (!uid) return;

    // Check if this mentor was invited as a tester (cheap Firestore check, no Auth call)
    const testerDoc = await adminFunctions.firestore().collection("testUsers").doc(uid).get();
    if (!testerDoc.exists) return;

    const mentorProfileId = event.params.profileId;

    // Create a match with Matchy Matcherson
    const matchRef = adminFunctions.firestore().collection("matches").doc();
    await matchRef.set({
      matchId: matchRef.id,
      menteeId: MATCHY_MATCHERSON_UID,
      mentorId: uid,
      menteeProfileId: MATCHY_MATCHERSON_PROFILE_ID,
      mentorProfileId,
      matchedAt: adminFunctions.firestore.Timestamp.now(),
      matchPercentage: 75,
      matchDetails: {
        technicalInterestsScore: 80,
        lifeExperiencesScore: 70,
        languagesScore: 75,
        menteeWeights: { technicalInterests: 3, lifeExperiences: 3, languages: 3 },
        mentorWeights: { technicalInterests: 3, lifeExperiences: 3, languages: 3 },
      },
      status: "pending",
      initiatedBy: "system",
      acceptedAt: null,
      completedAt: null,
      declinedAt: null,
      notes: "Test match created for mentor testing.",
      isTestMatch: true,
    });
  }
);

// ── Pre-authorize a non-OSU user (admin invites them directly) ───────────────
export const preAuthorizeUser = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("You are not signed in. Please sign in first.");
  }
  if (request.auth.token.admin !== true) {
    throw new Error("This function can be run by authorized Mentor Match Admins only.");
  }

  const email = request.data.email?.trim();
  if (!email) {
    throw new Error("Email address not provided.");
  }

  // Check if a Firebase Auth account already exists for this email
  let uid: string;
  try {
    const existing = await adminFunctions.auth().getUserByEmail(email);
    uid = existing.uid;
    // Already exists — just ensure allowed: true is set
    const existingClaims = existing.customClaims || {};
    await adminFunctions.auth().setCustomUserClaims(uid, {
      ...existingClaims,
      allowed: true,
    });
  } catch (err: any) {
    if (err.code === "auth/user-not-found") {
      // Create a new Auth account with no password
      const newUser = await adminFunctions.auth().createUser({
        email,
      });
      uid = newUser.uid;
      const claims: any = { allowed: true };
      if (request.data.isTester === true) claims.isTester = true;
      await adminFunctions.auth().setCustomUserClaims(uid, claims);
    } else {
      throw err;
    }
  }

  // Store tester flag in Firestore so trigger can check without Auth call
  if (request.data.isTester === true) {
    await adminFunctions.firestore().collection("testUsers").doc(uid).set({ isTester: true });
  }

  // Generate both a password setup link and an email verification link
  const setupLink = await adminFunctions.auth().generatePasswordResetLink(email);
  const verifyLink = await adminFunctions.auth().generateEmailVerificationLink(email);

  await sendMail(
    email,
    "You've Been Invited to EECS Mentor Match! 🎉",
    `Hi there!\n\nYou've been invited to join the EECS Mentor Match platform!\n\nPlease complete the following steps to get started:\n\nStep 1 - Verify your email address:\n${verifyLink}\n\nStep 2 - Set up your password:\n${setupLink}\n\nOnce both steps are complete, log in at:\n${SITE_URL}/login\n\nWe're excited to have you!\n\nThe EECS Mentor Match Team`
  );

  return { success: true, uid };
});

// ── Approve a pending non-OSU user ───────────────────────────────────────────
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

// ── Grant admin privileges ───────────────────────────────────────────────────
export const setAdminPrivileges = onCall(async (request) => {
  const admin_uid = request.data.admin_uid;

  if (!request.auth) {
    throw new Error("You are not signed in.  Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new Error("This function can be run by authorized Mentor Match Admins only.");
  }

  if (!admin_uid) {
    throw new Error("New Admin User ID (UID) not provided.");
  }

  const user = await adminFunctions.auth().getUser(admin_uid);
  const existingClaims = user.customClaims || {};
  await adminFunctions.auth().setCustomUserClaims(admin_uid, {
    ...existingClaims,
    admin: true,
  });
  return { success: true };
});

// ── Remove admin privileges ──────────────────────────────────────────────────
export const removeAdminPrivileges = onCall(async (request) => {
  const admin_uid = request.data.admin_uid;

  if (!request.auth) {
    throw new Error("You are not signed in.  Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new Error("This function can be run by authorized Mentor Match Admins only.");
  }

  if (!admin_uid) {
    throw new Error("Admin User ID (UID) not provided.");
  }

  if (request.auth.uid == admin_uid) {
    throw new Error("Admin may not remove their own admin Privileges.");
  }

  const user = await adminFunctions.auth().getUser(admin_uid);
  const existingClaims = user.customClaims || {};
  const { admin, ...claimsWithoutAdmin } = existingClaims;
  await adminFunctions.auth().setCustomUserClaims(admin_uid, claimsWithoutAdmin);
  return { success: true };
});

// ── Delete a user's Firebase Auth record ─────────────────────────────────────
export const deleteUserAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new Error("You are not signed in.  Please sign in first.");
  }

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

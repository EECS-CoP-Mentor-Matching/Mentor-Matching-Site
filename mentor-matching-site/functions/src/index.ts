import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import * as adminFunctions from "firebase-admin";

adminFunctions.initializeApp();

const SITE_URL = "https://eecscopmentormatch.com";
const SURVEY_LINK = "https://docs.google.com/forms/d/e/1FAIpQLSfpaXEgUVj7sa30uCTv3laYgaZhruD1vhuLrfTnxfZYbU-wsw/viewform?usp=dialog";

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
    throw new HttpsError("unauthenticated", "You are not signed in. Please sign in first.");
  }
  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "This function can be run by authorized Mentor Match Admins only.");
  }

  const email = request.data.email?.trim();
  if (!email) {
    throw new HttpsError("invalid-argument", "Email address not provided.");
  }

  // Check if this email has already been invited as a tester
  if (request.data.isTester === true) {
    const existingTesterSnap = await adminFunctions.firestore()
      .collection("testUsers")
      .where("email", "==", email)
      .limit(1)
      .get();
    if (!existingTesterSnap.empty) {
      // Check if their Auth account still exists — if not, clean up stale testUsers doc and allow re-invite
      const existingUID = existingTesterSnap.docs[0].id;
      try {
        await adminFunctions.auth().getUser(existingUID);
        // Auth account still exists — block the re-invite
        throw new HttpsError("already-exists", "This email has already been invited as a tester. Use Remove All Testers to clean up first.");
      } catch (authErr: any) {
        if (authErr.code === "auth/user-not-found") {
          // Auth account gone — clean up stale testUsers doc and allow re-invite
          await existingTesterSnap.docs[0].ref.delete();
        } else {
          throw authErr;
        }
      }
    }
  }

  // Check if a Firebase Auth account already exists for this email
  let uid: string;
  try {
    const existing = await adminFunctions.auth().getUserByEmail(email);
    uid = existing.uid;
    // Already exists — ensure allowed and isTester claims are set
    const existingClaims = existing.customClaims || {};
    const updatedClaims: any = { ...existingClaims, allowed: true };
    if (request.data.isTester === true) updatedClaims.isTester = true;
    await adminFunctions.auth().setCustomUserClaims(uid, updatedClaims);
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
    await adminFunctions.firestore().collection("testUsers").doc(uid).set({ isTester: true, email });
  }

  // Generate both a password setup link and an email verification link
  const setupLink = await adminFunctions.auth().generatePasswordResetLink(email);
  const verifyLink = await adminFunctions.auth().generateEmailVerificationLink(email);

  const isTester = request.data.isTester === true;
  const isTestMentee = request.data.isTestMentee === true;

  if (isTester && isTestMentee) {
    // Mentee tester email
    await sendMail(
      email,
      "You've Been Invited to Test EECS Mentor Match! 🎉",
      `Oregon State University\nSchool of Electrical Engineering and Computer Science\nEECS Mentor Match\n─────────────────────────────────────\n\nHi there!\n\nYou've been invited to be a tester of the EECS Mentor Match web application. We'd love your feedback on your experience!\n\nTo get started, please complete these steps in order:\n\n*** IMPORTANT: When setting up your profile, select MENTEE as your role ***\n\nSTEP 1 — Verify your email address:\n${verifyLink}\n\nSTEP 2 — Set up your password:\n${setupLink}\n\nSTEP 3 — Log in and complete your account profile at:\n${SITE_URL}/login\n\nSTEP 4 — Complete your matching profile by filling out the matching survey in your Mentee Portal (look for the Active Profiles tab)\n\nOnce both profiles are complete, look for this in your mentee portal:\n\n🔍 Head to the ACTIVE PROFILES tab — browse available mentors and send a match request to experience the full mentee flow!\n\nOnce you've explored the platform, please share your impressions by filling out our feedback questionnaire in a separate browser tab:\n${SURVEY_LINK}\n\nWe truly appreciate your time and look forward to hearing your thoughts!\n\nThe EECS Mentor Match Team`
    );
  } else if (isTester) {
    // Mentor tester email
    await sendMail(
      email,
      "You've Been Invited to Test EECS Mentor Match! 🎉",
      `Oregon State University\nSchool of Electrical Engineering and Computer Science\nEECS Mentor Match\n─────────────────────────────────────\n\nHi there!\n\nYou've been invited to be a tester of the EECS Mentor Match web application. We'd love your feedback on your experience!\n\nTo get started, please complete these steps in order:\n\n*** IMPORTANT: When setting up your profile, select MENTOR as your role ***\n\nSTEP 1 — Verify your email address:\n${verifyLink}\n\nSTEP 2 — Set up your password:\n${setupLink}\n\nSTEP 3 — Log in and complete your account profile at:\n${SITE_URL}/login\n\nSTEP 4 — Complete your matching profile by filling out the matching survey in your Mentor Portal (look for the Active Profiles tab)\n\nOnce both profiles are complete, look for this in your mentor portal:\n\n🔍 Check your PENDING REQUESTS tab — a test mentee match will be waiting for you to review! Accept the match to experience the full mentorship flow.\n\nOnce you've explored the platform, please share your impressions by filling out our feedback questionnaire in a separate browser tab:\n${SURVEY_LINK}\n\nWe truly appreciate your time and look forward to hearing your thoughts!\n\nThe EECS Mentor Match Team`
    );
  } else {
    // Regular invite email
    await sendMail(
      email,
      "You've Been Invited to EECS Mentor Match! 🎉",
      `Oregon State University\nSchool of Electrical Engineering and Computer Science\nEECS Mentor Match\n─────────────────────────────────────\n\nHi there!\n\nYou've been invited to join the EECS Mentor Match platform!\n\nPlease complete the following steps to get started:\n\nStep 1 — Verify your email address:\n${verifyLink}\n\nStep 2 — Set up your password:\n${setupLink}\n\nOnce both steps are complete, log in at:\n${SITE_URL}/login\n\nWe're excited to have you!\n\nThe EECS Mentor Match Team`
    );
  }

  return { success: true, uid };
});

// ── Auto-accept match when test mentee connects with Marty Mentorson ────────
const MARTY_MENTORSON_UID = "DemoMentor1";

export const autoAcceptTestMenteeMatch = onDocumentCreated(
  "matches/{matchId}",
  async (event) => {
    const matchData = event.data?.data();
    if (!matchData) return;

    // Only auto-accept matches with Marty Mentorson
    if (matchData.mentorId !== MARTY_MENTORSON_UID) return;

    // Only auto-accept for test mentees
    const menteeUID = matchData.menteeId;
    const testerDoc = await adminFunctions.firestore().collection("testUsers").doc(menteeUID).get();
    if (!testerDoc.exists) return;

    // Auto-accept the match
    await event.data?.ref.update({
      status: "accepted",
      acceptedAt: adminFunctions.firestore.Timestamp.now(),
    });
  }
);

// ── Remove all tester accounts and their data ────────────────────────────────
export const removeAllTesters = onCall(async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "You are not signed in.");
  if (request.auth.token.admin !== true) throw new HttpsError("permission-denied", "Admins only.");

  const testUsersSnap = await adminFunctions.firestore().collection("testUsers").get();
  if (testUsersSnap.empty) return { success: true, removed: 0 };

  let removed = 0;

  for (const testerDoc of testUsersSnap.docs) {
    const uid = testerDoc.id;

    // Delete userProfile
    await adminFunctions.firestore().doc(`userProfile/${uid}`).delete().catch(() => {});

    // Delete mentorProfile
    const mentorSnap = await adminFunctions.firestore().collection("mentorProfile").where("UID", "==", uid).get();
    for (const doc of mentorSnap.docs) await doc.ref.delete();

    // Delete menteeProfile (but never DemoMentee1 — that's Matchy Matcherson!)
    const menteeSnap = await adminFunctions.firestore().collection("menteeProfile").where("UID", "==", uid).get();
    for (const doc of menteeSnap.docs) {
      if (doc.data().UID !== "DemoMentee1") await doc.ref.delete();
    }

    // Delete matches where tester is mentor or mentee
    const matchesMentorSnap = await adminFunctions.firestore().collection("matches").where("mentorId", "==", uid).get();
    for (const doc of matchesMentorSnap.docs) await doc.ref.delete();
    const matchesMenteeSnap = await adminFunctions.firestore().collection("matches").where("menteeId", "==", uid).get();
    for (const doc of matchesMenteeSnap.docs) await doc.ref.delete();

    // Delete messages sent by or to tester
    const msgSentSnap = await adminFunctions.firestore().collection("messages").where("senderUID", "==", uid).get();
    for (const doc of msgSentSnap.docs) await doc.ref.delete();
    const msgRecvSnap = await adminFunctions.firestore().collection("messages").where("recipientUID", "==", uid).get();
    for (const doc of msgRecvSnap.docs) await doc.ref.delete();

    // Delete testUsers document
    await testerDoc.ref.delete();

    // Delete Firebase Auth account
    await adminFunctions.auth().deleteUser(uid).catch(() => {});

    removed++;
  }

  return { success: true, removed };
});

// ── Approve a pending non-OSU user ───────────────────────────────────────────
export const approvePendingUser = onCall(async (request) => {
  const userData = request.data;

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You are not signed in. Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "This function can be run by authorized Mentor Match Admins only.");
  }

  const uid = userData.uid;
  if (!uid) {
    throw new HttpsError("invalid-argument", "User ID (UID) not provided.");
  }

  await adminFunctions.auth().setCustomUserClaims(uid, { allowed: true });
  await adminFunctions.firestore().doc(`pendingUsers/${uid}`).delete();

  return { success: true };
});

// ── Grant admin privileges ───────────────────────────────────────────────────
export const setAdminPrivileges = onCall(async (request) => {
  const admin_uid = request.data.admin_uid;

  if (!request.auth) {
    throw new HttpsError("unauthenticated", "You are not signed in. Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "This function can be run by authorized Mentor Match Admins only.");
  }

  if (!admin_uid) {
    throw new HttpsError("invalid-argument", "New Admin User ID (UID) not provided.");
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
    throw new HttpsError("unauthenticated", "You are not signed in. Please sign in first.");
  }

  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "This function can be run by authorized Mentor Match Admins only.");
  }

  if (!admin_uid) {
    throw new HttpsError("invalid-argument", "Admin User ID (UID) not provided.");
  }

  if (request.auth.uid == admin_uid) {
    throw new HttpsError("failed-precondition", "Admin may not remove their own admin privileges.");
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
    throw new HttpsError("unauthenticated", "You are not signed in. Please sign in first.");
  }

  const callerProfile = await adminFunctions.firestore()
    .doc(`userProfile/${request.auth.uid}`)
    .get();

  if (!callerProfile.exists) {
    throw new HttpsError("not-found", "Caller profile not found.");
  }

  if (request.auth.token.admin !== true) {
    throw new HttpsError("permission-denied", "This function can be run by authorized Mentor Match Admins only.");
  }

  const uid = request.data.uid;
  if (!uid) {
    throw new HttpsError("invalid-argument", "User ID (UID) not provided.");
  }

  await adminFunctions.auth().deleteUser(uid);

  return { success: true };
});

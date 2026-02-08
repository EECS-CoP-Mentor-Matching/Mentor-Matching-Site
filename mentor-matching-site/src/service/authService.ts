import { createUserWithEmailAndPassword, sendSignInLinkToEmail, sendEmailVerification, signInWithEmailAndPassword,
  isSignInWithEmailLink, signInWithEmailLink, setPersistence, browserSessionPersistence, getAuth,
  User } from "firebase/auth";
import { app } from "../firebaseConfig";
import { deleteUser } from "firebase/auth";


const firebaseAuth = getAuth(app)

/** Send sign in link to user email */
async function sendEmailSignIn(email: string ): Promise<void> {
  const auth = getAuth();

  const actionCodeSettings = {
    url: 'https://eecs-cop-mentor-matching-site.web.app/signin-verify-email',
    handleCodeInApp: true,
  };
  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
}

/** Check verify email link */
async function signInSecure(email: string ): Promise<void> {
  const auth = getAuth();

  // Check if the current URL contains the sign-in link
  if (isSignInWithEmailLink(auth, window.location.href)) {

    // Sign in with the email link
    signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
        })
        .catch((error) => {
          console.error('Error signing in: ', error);
        });
  }
}

/** Send verification email for a user */
async function sendVerifyEmail(user: User ): Promise<void> {
  await sendEmailVerification(user);
}

/** create a new user and store in firebase */
async function createUser(email: string, password: string): Promise<User | void> {
  const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

  await sendVerifyEmail(userCredential.user);

  return userCredential.user;
}

/** use this method if the device is shared i.e. computer labs */
async function signInSession(email: string, password: string): Promise<User> {
  try {
    // 1. Set persistence to 'session' (clears on tab/window close)
    await setPersistence(firebaseAuth, browserSessionPersistence);
    
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    
    // 2. Perform the sign-in and return the user object
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    return userCredential.user;
  } catch (error) {
    // Re-throw the error so your Login.tsx 'catch' block can catch it
    throw error;
  }
}

/** use this method if the device is not shared */
async function signIn(email: string, password: string): Promise<User | void> {
  return signInWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
      // Signed in 
      return userCredential.user;
    })
}

async function deleteUserAccount() {
  const user = firebaseAuth.currentUser;
  if (user) {
    return deleteUser(user).then(() => {
      // User deleted.
      console.log('User account deleted successfully.');
    }).catch((error) => {
      // An error occurred
      console.error('Error deleting user account:', error);
      throw error; // Throw error to handle it on UI level, like reauthentication requirement
    });
  } else {
    console.log('No signed-in user to delete.');
    throw new Error('No signed-in user to delete.');
  }
}

function signOut() {
  firebaseAuth.signOut();
}

async function waitForAuthState() {
  await firebaseAuth.authStateReady();
}

async function getSignedInUser() {
  await firebaseAuth.authStateReady();
  return firebaseAuth.currentUser;
}

async function refreshToken() {
  const user = firebaseAuth.currentUser;
  if (user) {
    await user.getIdToken(true);
    await user.reload();
  }
}

const authService = {
  sendEmailSignIn,
  signInSecure,
  refreshToken,
  sendVerifyEmail,
  createUser,
  signIn,
  signInSession,
  getSignedInUser,
  signOut,
  waitForAuthState,
  deleteUserAccount // Added method
}

export default authService;
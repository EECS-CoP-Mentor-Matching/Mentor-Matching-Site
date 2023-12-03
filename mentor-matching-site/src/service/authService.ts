import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, getAuth, User, UserCredential } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app)

/** create a new user and store in firebase */
function createUser(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      return user;
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ..
    });
}

/** use this method if the device is shared i.e. computer labs */ 
function signInSession(email: string, password: string) {
  setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}

/** use this method if the device is not shared */
async function signIn(email: string, password: string): Promise<User | void> {
  return signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      return userCredential.user;
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
}

function signOut() {
  auth.signOut();
}

async function waitForAuthState() {
  await auth.authStateReady();
}

async function getSignedInUser() {
  await auth.authStateReady();
  return auth.currentUser;
}

const authService = {
  createUser,
  signIn,
  signInSession,
  getSignedInUser,
  signOut,
  waitForAuthState
}

export default authService;
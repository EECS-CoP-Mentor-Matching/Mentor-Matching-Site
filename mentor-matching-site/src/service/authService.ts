import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, getAuth, User } from "firebase/auth";
import { app } from "../firebaseConfig";
import { deleteUser } from "firebase/auth";


const firebaseAuth = getAuth(app)

/** create a new user and store in firebase */
async function createUser(email: string, password: string): Promise<User | void> {
  return await createUserWithEmailAndPassword(firebaseAuth, email, password)
    .then((userCredential) => {
      // Signed up 
      return userCredential.user;
    });
}

/** use this method if the device is shared i.e. computer labs */
function signInSession(email: string, password: string) {
  setPersistence(firebaseAuth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      return signInWithEmailAndPassword(firebaseAuth, email, password);
    })
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

const authService = {
  createUser,
  signIn,
  signInSession,
  getSignedInUser,
  signOut,
  waitForAuthState,
  deleteUserAccount // Added method
}

export default authService;
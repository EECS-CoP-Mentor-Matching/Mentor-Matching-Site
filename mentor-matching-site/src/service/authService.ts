import { createUserWithEmailAndPassword, signInWithEmailAndPassword, setPersistence, browserSessionPersistence, getAuth } from "firebase/auth";
import { app } from "../firebaseConfig";

const auth = getAuth(app)

function createUser(email: string, password: string) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed up 
      const user = userCredential.user;
      return user;
      // ...
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // ..
    });
}

function signIn(email: string, password: string) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      // const user = userCredential.user;
      // ...
      persistLogin(email, password);
    })
    .catch((error) => {
      // const errorCode = error.code;
      // const errorMessage = error.message;
    });
}

function persistLogin(email: string, password: string) {
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

export const authService = {
  createUser,
  signIn
}
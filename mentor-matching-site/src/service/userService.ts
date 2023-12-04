import { db } from "../firebaseConfig";
import { UserProfile } from "../types";

// Function to create a new user profile in Firestore
async function createNewUser(userProfile: UserProfile) {
  try {
    // Access Firestore collection 'users' and add a new document
    //const usersCollection = db.collection("users");
    //await usersCollection.doc(userProfile.UID).set(userProfile);

    console.log("User profile created successfully.");
    // You might return something here if needed
  } catch (error) {
    console.error("Error creating user profile:", error);
    // You can throw or handle the error as needed
    throw new Error("Failed to create user profile.");
  }
}

const userService = {
  createNewUser,
};

export default userService;
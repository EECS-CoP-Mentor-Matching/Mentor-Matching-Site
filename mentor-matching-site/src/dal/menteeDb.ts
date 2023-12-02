import { db } from "../firebaseConfig";
import { collection, getDocs } from "firebase/firestore/lite";

async function readInterests() {
  const interestsCollection = collection(db, "interests");
  const interestsSnapshot = await getDocs(interestsCollection);
  const interests = interestsSnapshot.docs.map((doc) => doc.data());
  return interests;
}

const menteeDb = {
  readInterests
}

export default menteeDb;
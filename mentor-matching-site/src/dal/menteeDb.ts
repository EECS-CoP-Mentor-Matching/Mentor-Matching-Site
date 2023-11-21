import { db } from "./firebaseConfig";

async function readInterests() {
  const interestsSnapshot = await db.collection("interests").get();
  const interests = interestsSnapshot.docs.map((doc) => doc.data());
  return interests;
}

const menteeDb = {
  readInterests
}

export default menteeDb;
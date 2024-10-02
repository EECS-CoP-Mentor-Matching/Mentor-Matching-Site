// settingsService.ts
import { collection, getDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface SettingsData {
  isTitleRequired: boolean;
  isContentRequired: boolean;
  isTypeRequired: boolean;
  isAttachmentAllowed: boolean;
}

async function getSettings(): Promise<SettingsData> {
  const docRef = doc(db, "settings", "global");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as SettingsData;
  } else {
    // Default settings if not found in the database
    return {
      isTitleRequired: true,
      isContentRequired: true,
      isTypeRequired: true,
      isAttachmentAllowed: true,
    };
  }
}

async function updateSettings(settings: SettingsData): Promise<void> {
  const docRef = doc(db, "settings", "global");
  await setDoc(docRef, settings);
}

export { getSettings, updateSettings };
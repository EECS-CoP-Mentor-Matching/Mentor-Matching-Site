import { collection, addDoc, getDocs, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

import { db, storage } from "../firebaseConfig"; // Import storage from firebaseConfig
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import correct modules

interface FeedbackData {
  id?: string;
  userEmail: string;
  feedbackType: string;
  feedbackTitle: string;
  feedbackContent: string;
  attachmentUrl?: string;
  isResolved: boolean;
  timestamp?: any;
}

interface FeedbackResponse {
  data: FeedbackData[];
}

async function submitFeedback(feedbackData: FeedbackData, attachment?: File): Promise<void> {
  try {
    let attachmentUrl: string | undefined;

    if (attachment) {
      const storageRef = ref(storage, `attachments/${Date.now()}_${attachment.name}`);
      await uploadBytes(storageRef, attachment);
      attachmentUrl = await getDownloadURL(storageRef);
    }

    feedbackData.attachmentUrl = attachmentUrl;
    
    feedbackData.timestamp = serverTimestamp();

    await addDoc(collection(db, "feedback"), feedbackData);
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

async function fetchFeedbackEntries(): Promise<FeedbackResponse> {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    const feedbackEntries: FeedbackData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FeedbackData;
      data.id = doc.id; // Add the document ID to the data
      feedbackEntries.push(data);
    });
    return { data: feedbackEntries };
  } catch (error) {
    console.error("Error fetching feedback entries:", error);
    throw error;
  }
}

async function deleteFeedbackEntry(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "feedback", id));
  } catch (error) {
    console.error("Error deleting feedback entry:", error);
    throw error;
  }
}

const feedbackService = {
  submitFeedback,
  fetchFeedbackEntries,
  deleteFeedbackEntry,
};

export default feedbackService;
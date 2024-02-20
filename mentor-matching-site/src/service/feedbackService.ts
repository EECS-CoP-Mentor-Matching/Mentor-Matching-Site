import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, storage } from "../firebaseConfig"; // Import storage from firebaseConfig
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import correct modules

interface FeedbackData {
  userEmail: string;
  feedbackType: string;
  feedbackTitle: string;
  feedbackContent: string;
  attachmentUrl?: string;
  isResolved: boolean;
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
      feedbackEntries.push(doc.data() as FeedbackData);
    });
    return { data: feedbackEntries };
  } catch (error) {
    console.error("Error fetching feedback entries:", error);
    throw error;
  }
}

const feedbackService = {
  submitFeedback,
  fetchFeedbackEntries,
};

export default feedbackService;
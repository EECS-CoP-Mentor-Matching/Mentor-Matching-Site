import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; 

interface FeedbackData {
  userEmail: string;
  feedbackType: string;
  feedbackContent: string;
  isResolved: boolean;
}

/** Submit feedback to Firebase */
async function submitFeedback(feedbackData: FeedbackData): Promise<void> {
  try {
    await addDoc(collection(db, "feedback"), feedbackData);
    // Feedback submitted successfully
  } catch (error) {
    // Handle error
    console.error("Error submitting feedback:", error);
    throw error;
  }
}

/** Fetch feedback entries from Firebase */
async function fetchFeedbackEntries(): Promise<FeedbackData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    const feedbackEntries: FeedbackData[] = [];
    querySnapshot.forEach((doc) => {
      feedbackEntries.push(doc.data() as FeedbackData);
    });
    return feedbackEntries;
  } catch (error) {
    // Handle error
    console.error("Error fetching feedback entries:", error);
    throw error;
  }
}

const feedbackService = {
  submitFeedback,
  fetchFeedbackEntries,
};

export default feedbackService;
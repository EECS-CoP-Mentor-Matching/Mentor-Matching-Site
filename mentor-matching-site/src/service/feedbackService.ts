import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig"; 

interface FeedbackData {
  userEmail: string;
  feedbackType: string;
  feedbackContent: string;
  isResolved: boolean;

}

interface FeedbackResponse {
  data: FeedbackData[];
}

/** Submit feedback to Firebase */
async function submitFeedback(feedbackData: FeedbackData): Promise<{ success: boolean; error?: string }> {
  try {
    await addDoc(collection(db, "feedback"), feedbackData);
    // Feedback submitted successfully
    return { success: true };
  } catch (error) {
    // Handle error
    console.error("Error submitting feedback:", error);
    return { success: false, error: (error as Error).message };
  }
}



/** Fetch feedback entries from Firebase */
async function fetchFeedbackEntries(): Promise<FeedbackResponse> {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    const feedbackEntries: FeedbackData[] = [];
    querySnapshot.forEach((doc) => {
      feedbackEntries.push(doc.data() as FeedbackData);
    });
    console.log(feedbackEntries);
    return { data: feedbackEntries };
  } catch (error) {
    // Handle error
    console.error("Error fetching feedback entries:", error);
    return { data: [] }; // Return an empty array if there's an error
  }
}

const feedbackService = {
  submitFeedback,
  fetchFeedbackEntries,
};

export default feedbackService;
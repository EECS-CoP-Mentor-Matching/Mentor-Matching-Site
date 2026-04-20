import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface FeedbackData {
  id?: string;
  UID: string;
  userEmail: string | null;
  feedbackType: string;
  feedbackTitle: string;
  feedbackContent: string;
  attachmentUrl?: string;
  isResolved: boolean;
  timestamp?: any;
  // Positive Review fields
  publicConsent: boolean;
  includeProfilePicture: boolean;
  postedOnHomePage: boolean;
  // Snapshot of user info at time of submission
  snapshotName: string;
  snapshotPictureUrl: string;
  snapshotRoleInfo: string;
}

interface FeedbackResponse {
  data: FeedbackData[];
}

// Copies a profile image from its current location to a permanent
// publicReviews storage path so it survives profile updates/deletions
async function copyProfileImageForReview(
  sourceUrl: string,
  feedbackId: string
): Promise<string> {
  try {
    // Fetch the image as a blob
    const response = await fetch(sourceUrl);
    if (!response.ok) throw new Error('Failed to fetch profile image');
    const blob = await response.blob();

    // Upload to a permanent location tied to the feedback entry
    const storageRef = ref(storage, `publicReviews/${feedbackId}/profileImage`);
    await uploadBytes(storageRef, blob);
    const permanentUrl = await getDownloadURL(storageRef);
    return permanentUrl;
  } catch (error) {
    console.error('Error copying profile image for review:', error);
    // Return the original URL as fallback if copy fails
    return sourceUrl;
  }
}

async function submitFeedback(
  feedbackData: FeedbackData,
  attachment?: File,
  profileImageUrl?: string
): Promise<void> {
  try {
    let attachmentUrl: string | undefined;

    if (attachment) {
      const storageRef = ref(storage,
        `${feedbackData.UID}/attachments/${Date.now()}_${attachment.name}`);
      await uploadBytes(storageRef, attachment);
      attachmentUrl = await getDownloadURL(storageRef);
    }

    if (attachmentUrl) {
      feedbackData.attachmentUrl = attachmentUrl;
    }

    feedbackData.timestamp = serverTimestamp();

    // Add the document first to get an ID
    const docRef = await addDoc(collection(db, "feedback"), feedbackData);

    // If a profile image needs to be copied, do it now using the doc ID
    if (profileImageUrl && feedbackData.includeProfilePicture) {
      const permanentUrl = await copyProfileImageForReview(profileImageUrl, docRef.id);
      // Update the document with the permanent picture URL
      await updateDoc(docRef, { snapshotPictureUrl: permanentUrl });
    }

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
      data.id = doc.id;
      feedbackEntries.push(data);
    });
    return { data: feedbackEntries };
  } catch (error) {
    console.error("Error fetching feedback entries:", error);
    throw error;
  }
}

async function fetchApprovedReviews(): Promise<FeedbackData[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "feedback"));
    const approved: FeedbackData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data() as FeedbackData;
      data.id = doc.id;
      if (
        data.feedbackType === 'Positive Review' &&
        data.publicConsent === true &&
        data.postedOnHomePage === true
      ) {
        approved.push(data);
      }
    });
    return approved;
  } catch (error) {
    // Return empty array silently — home page will show fallback cards
    return [];
  }
}

async function updateFeedbackEntry(id: string, updates: Partial<FeedbackData>): Promise<void> {
  try {
    const feedbackRef = doc(db, "feedback", id);
    await updateDoc(feedbackRef, updates as { [key: string]: any });
  } catch (error) {
    console.error("Error updating feedback entry:", error);
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
  fetchApprovedReviews,
  updateFeedbackEntry,
  deleteFeedbackEntry,
};

export default feedbackService;

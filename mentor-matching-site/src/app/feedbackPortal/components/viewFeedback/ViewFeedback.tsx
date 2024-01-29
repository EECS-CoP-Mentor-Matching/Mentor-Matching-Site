import React, { useEffect, useState } from 'react';
import feedbackService from './../../../../service/feedbackService'
interface FeedbackEntry {
  userEmail: string;
  feedbackType: string;
  feedbackContent: string;
  isResolved: boolean;
}

export default function ViewFeedback() {
  const [feedbackEntries, setFeedbackEntries] = useState<FeedbackEntry[]>([]);

  

  useEffect(() => {
    const fetchFeedbackEntries = async () => {
      try {
        const response = await feedbackService.fetchFeedbackEntries();
setFeedbackEntries(response.data);
        setFeedbackEntries(response.data);
      } catch (error) {
        console.error('Error fetching feedback entries:', error);
      }
    };

    fetchFeedbackEntries();
  }, []);

  return (
    <div>
      <h2>View Feedback</h2>
      <ul>
        {feedbackEntries.map((entry, index) => (
          <li key={index}>
            <strong>User Email:</strong> {entry.userEmail}<br />
            <strong>Feedback Type:</strong> {entry.feedbackType}<br />
            <strong>Feedback Content:</strong> {entry.feedbackContent}<br />
            <strong>Resolved:</strong> {entry.isResolved ? 'Yes' : 'No'}<br />
          </li>
        ))}
      </ul>
    </div>
  );
};

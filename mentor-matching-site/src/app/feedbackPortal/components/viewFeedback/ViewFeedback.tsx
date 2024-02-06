import React, { useEffect, useState } from 'react';
import feedbackService from './../../../../service/feedbackService'

import './../submitFeedback/SubmitFeedback.css';
import './ViewFeedback.css';

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
    <div className='feedback-profile'>
      <h2>View Feedback</h2>
      <div>
        {feedbackEntries.map((entry, index) => (
          
          <div className="feedback-interest view-feedback">
          <div key={index}>
            <strong>{index+1}</strong><br />
            <strong>User Email:</strong> {entry.userEmail}<br />
            <strong>Feedback Type:</strong> {entry.feedbackType}<br />
            <strong>Feedback Content:</strong> {entry.feedbackContent}<br />
            <strong>Resolved:</strong> {entry.isResolved ? 'Yes' : 'No'}<br />
          </div>
          </div>
        ))}
      </div>
    </div>
  );
};

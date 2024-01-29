import React, { useState } from 'react';
import feedbackService from './../../../../service/feedbackService'

interface SubmitFeedbackProps {
  userEmail: string;
}

export default function SubmitFeedback({ userEmail }: SubmitFeedbackProps) {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedbackContent, setFeedbackContent] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const feedbackData = {
      userEmail,
      feedbackType,
      feedbackContent,
      isResolved: false, // Default is false for new feedback
    };

    try {
    
        /*
      const response = await feedbackService.submitFeedback(feedbackData);
      alert(response.success ? 'Feedback submitted successfully!' : `Error: ${response.error}`);
      // Optionally, you can redirect or perform additional actions after successful submission
      */
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback.');
      
    }
  };

  return (
    <div>
      <h2>Submit Feedback</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Feedback Type:
          <select
            value={feedbackType}
            onChange={(e) => setFeedbackType(e.target.value)}
            required
          >
            <option value="">Select Type</option>
            <option value="siteImprovements">Site Improvements</option>
            <option value="policyQuestions">Questions about Policy</option>
            <option value="general">General</option>
          </select>
        </label>

        <label>
          Feedback Content:
          <textarea
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
            required
          />
        </label>

        <button type="submit">Submit Feedback</button>
      </form>
    </div>
  );
};

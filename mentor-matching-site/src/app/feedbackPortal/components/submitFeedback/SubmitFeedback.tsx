import React, { useState } from 'react';
import feedbackService from './../../../../service/feedbackService'
import './SubmitFeedback.css';
import { FormLabel, Button } from "@mui/material";
import { TextField, Autocomplete } from "@mui/material";
import DropDownControl from "../../../common/forms/dropDowns/DropDownControl";
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

    
    const response = await feedbackService.submitFeedback(feedbackData);
    alert(response.success ? 'Feedback submitted successfully!' : `Error: ${response.error}`);
    
  
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback.');

    } 
  };

  const feedbackSelection = [
    { label: 'Site Improvements', id: 1 },
    { label: 'Questions about Policy', id: 1 },
    { label: 'General', id: 1 },
  ]

  return (
    <div className="feedback-profile">
      <FormLabel>Submit Feedback</FormLabel>
      <div className='feedack-interest'>
      <form onSubmit={handleSubmit}>
        <DropDownControl label="Feedback Type" options={feedbackSelection} onSelect={(value) => setFeedbackType(value)} />
        <TextField
          label="Feedback Content"
          value={feedbackContent}
          onChange={(e) => setFeedbackContent(e.target.value)}
          required
        />
        <div className='feedback-interest'>
        <Button type="submit">Submit Feedback</Button>
        </div>
      </form>
      </div>
      </div>
     
  );
};

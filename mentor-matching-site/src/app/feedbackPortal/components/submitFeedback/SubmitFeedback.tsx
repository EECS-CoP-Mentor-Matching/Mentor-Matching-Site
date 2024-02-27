import React, { useContext, useState } from 'react';
import feedbackService from './../../../../service/feedbackService'
import './SubmitFeedback.css';
import { FormLabel, Button } from "@mui/material";
import { TextField } from "@mui/material";
import DropDownControl from "../../../common/forms/dropDowns/DropDownControl";
import { FeedbackSettingsContext } from './../FeedbackSettings/FeedbackSettingsContext';


interface SubmitFeedbackProps {
  userEmail: string;
}


export default function SubmitFeedback({ userEmail }: SubmitFeedbackProps) {
  const [feedbackType, setFeedbackType] = useState<string>('');
  const [feedbackTitle, setFeedbackTitle] = useState<string>(''); // Add this line
  const [feedbackContent, setFeedbackContent] = useState<string>('');
  const [attachment, setAttachment] = useState<File | undefined>(undefined);
  const {
    isTitleRequired,
    isContentRequired,
    isTypeRequired,
    isAttachmentAllowed
  } = useContext(FeedbackSettingsContext);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!feedbackTitle.trim() || !feedbackContent.trim() || !feedbackType) {
      alert('Feedback title, content and type cannot be empty.');
      return;
    }

    const feedbackData = {
      userEmail,
      feedbackType,
      feedbackTitle,
      feedbackContent,
      isResolved: false,
    };

    try {
      await feedbackService.submitFeedback(feedbackData, attachment);
      setFeedbackType('');
      setFeedbackTitle('');
      setFeedbackContent('');
      setAttachment(undefined);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred while submitting feedback.');
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setAttachment(file);
    } else {
      setAttachment(undefined);
    }
  };

  const feedbackSelection = [
    { label: 'Site Improvements', id: 1 },
    { label: 'Questions about Policy', id: 2 },
    { label: 'General', id: 3 },
  ]

  return (
      <div className="feedback-profile">
        <FormLabel>Submit Feedback</FormLabel>
        <form onSubmit={handleSubmit}>
          <div className='feedback-interest'>
            <TextField
              label="Feedback Title"
              value={feedbackTitle}
              onChange={(e) => setFeedbackTitle(e.target.value)}
              required={isTitleRequired}
            />
          <DropDownControl label="Feedback Type" options={feedbackSelection} onSelect={(value) => setFeedbackType(value)} required={isTypeRequired} valueIs='label' />
          <TextField
            label="Feedback Content"
            value={feedbackContent}
            onChange={(e) => setFeedbackContent(e.target.value)}
            required={isContentRequired}
            multiline
            rows={4}

          />
          {isAttachmentAllowed && <input type="file" onChange={handleAttachmentChange} />}
          <div className='feedback-interest'>
            <Button type="submit">Submit Feedback</Button>
          </div>
        </div>
      </form>
    </div>

  );
};
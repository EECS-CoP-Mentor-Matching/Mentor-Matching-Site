import React from 'react';
import ViewFeedback from './viewFeedback/ViewFeedback';
import FeedbackSettings from '../FeedbackSettings/FeedbackSettings';

export default function FeedbackAdminPortal() {
  return (
    <div>
      <FeedbackSettings />
      <ViewFeedback />
    </div>
  );
};
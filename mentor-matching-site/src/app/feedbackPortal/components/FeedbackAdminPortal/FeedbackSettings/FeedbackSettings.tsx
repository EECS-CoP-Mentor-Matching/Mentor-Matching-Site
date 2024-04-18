import React, { useContext } from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { FeedbackSettingsContext } from './FeedbackSettingsContext';

export default function FeedbackSettings() {
  const {
    isTitleRequired, setIsTitleRequired,
    isContentRequired, setIsContentRequired,
    isTypeRequired, setIsTypeRequired,
    isAttachmentAllowed, setIsAttachmentAllowed
  } = useContext(FeedbackSettingsContext);

  return (
    <div>
      <h2>Feedback Settings</h2>
      <FormControlLabel
        control={<Switch checked={isTitleRequired} onChange={() => setIsTitleRequired(!isTitleRequired)} />}
        label="Feedback Title Required"
      />
      <FormControlLabel
        control={<Switch checked={isContentRequired} onChange={() => setIsContentRequired(!isContentRequired)} />}
        label="Feedback Content Required"
      />
      <FormControlLabel
        control={<Switch checked={isTypeRequired} onChange={() => setIsTypeRequired(!isTypeRequired)} />}
        label="Feedback Type Required"
      />
      <FormControlLabel
        control={<Switch checked={isAttachmentAllowed} onChange={() => setIsAttachmentAllowed(!isAttachmentAllowed)} />}
        label="Attachment Allowed"
      />
    </div>
  );
};
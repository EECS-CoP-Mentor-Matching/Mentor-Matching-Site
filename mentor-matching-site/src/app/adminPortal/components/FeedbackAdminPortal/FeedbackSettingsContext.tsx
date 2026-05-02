import React from 'react';

export const FeedbackSettingsContext = React.createContext({
  isTitleRequired: true,
  setIsTitleRequired: (value: boolean) => {},
  isContentRequired: true,
  setIsContentRequired: (value: boolean) => {},
  isTypeRequired: true,
  setIsTypeRequired: (value: boolean) => {},
  isAttachmentAllowed: true,
  setIsAttachmentAllowed: (value: boolean) => {},
});
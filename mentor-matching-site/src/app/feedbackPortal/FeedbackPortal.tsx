import { useEffect, useState } from 'react';
import './FeedbackPortal.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';

import SubmitFeedback from '../adminPortal/components/FeedbackAdminPortal/submitFeedback/SubmitFeedback';
import ViewFeedback from '../adminPortal/components/FeedbackAdminPortal/viewFeedback/ViewFeedback';
import FeedbackSettings from '../adminPortal/components/FeedbackSettings/FeedbackSettings';
import FeedbackAdminPortal from '../adminPortal/components/FeedbackAdminPortal/FeedbackAdminPortal';

import { FeedbackSettingsContext } from '../adminPortal/components/FeedbackSettings/FeedbackSettingsContext';

import React from 'react';
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';

export enum FeedbackPages {
  submitFeedback = 'Submit Feedback',
  // viewFeedback = 'View Feedback',
  // settings = 'Settings',
  // feedbackAdminPortal = 'Admin Portal'
}

interface FeedbackPortalProps {
  userEmail: string; // Assuming the user's email is available
}

function FeedbackPortal({ userEmail }: FeedbackPortalProps) {
  const [page, setPage] = useState(FeedbackPages.submitFeedback.toString());
  const navigate = useNavigate();

  const [isTitleRequired, setIsTitleRequired] = useState(true);
  const [isContentRequired, setIsContentRequired] = useState(true);
  const [isTypeRequired, setIsTypeRequired] = useState(true);
  const [isAttachmentAllowed, setIsAttachmentAllowed] = useState(true);

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      if (user === undefined) {
        navigate('/login');
      }
    };
    checkAuthState();
  }, [navigate]);

  return (
    <>
      <AuthenticatedView>
        <FeedbackSettingsContext.Provider value={{
          isTitleRequired, setIsTitleRequired,
          isContentRequired, setIsContentRequired,
          isTypeRequired, setIsTypeRequired,
          isAttachmentAllowed, setIsAttachmentAllowed
        }}>
          <PortalNavigationBar
            selected={page}
            onNavChange={setPage}
            navItems={navUtilities.navItemsFromEnum(FeedbackPages)}
          />

          {page === FeedbackPages.submitFeedback && <div className="feedback-portal"><SubmitFeedback userEmail={userEmail} /> </div>}
          {/*
        {page === FeedbackPages.viewFeedback && <div className="feedback-portal"><ViewFeedback /></div>}
        {page === FeedbackPages.settings && <div className="feedback-portal"><FeedbackSettings /></div>}
    */}
          {/*page === FeedbackPages.feedbackAdminPortal && <div className="feedback-portal"><FeedbackAdminPortal /></div>*/}
        </FeedbackSettingsContext.Provider>
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default FeedbackPortal;
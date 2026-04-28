import { useEffect, useState } from 'react';
import './FeedbackPortal.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
import SubmitFeedback from '../adminPortal/components/FeedbackAdminPortal/submitFeedback/SubmitFeedback';
import React from 'react';
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';

export enum FeedbackPages {
  submitFeedback = 'Submit Feedback',
}

function FeedbackPortal() {
  const [page, setPage] = useState(FeedbackPages.submitFeedback.toString());
  const navigate = useNavigate();

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
        <PortalNavigationBar
          selected={page}
          onNavChange={setPage}
          navItems={navUtilities.navItemsFromEnum(FeedbackPages)}
        />
        {page === FeedbackPages.submitFeedback && (
          <div className="feedback-portal">
            <SubmitFeedback />
          </div>
        )}
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default FeedbackPortal;

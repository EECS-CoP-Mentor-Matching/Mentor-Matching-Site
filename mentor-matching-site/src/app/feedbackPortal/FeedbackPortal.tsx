import { useEffect, useState } from 'react';
import './FeedbackPortal.css';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';

import SubmitFeedback from './components/submitFeedback/SubmitFeedback';
import ViewFeedback from './components/viewFeedback/ViewFeedback';
import FeedbackSettings from './components/FeedbackSettings/FeedbackSettings';

export enum FeedbackPages {
  submitFeedback = 'Submit Feedback',
  viewFeedback = 'View Feedback',
  settings = 'Settings'
}

interface FeedbackPortalProps {
  userEmail: string; // Assuming the user's email is available
}

function FeedbackPortal({ userEmail }: FeedbackPortalProps) {
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
      <PortalNavigationBar
        selected={page}
        onNavChange={setPage}
        navItems={navUtilities.navItemsFromEnum(FeedbackPages)}
      />
      {page === FeedbackPages.submitFeedback && <SubmitFeedback userEmail={userEmail} />}
      {page === FeedbackPages.viewFeedback && <ViewFeedback />}
      {page === FeedbackPages.settings && <FeedbackSettings />}
    </>
  );
}

export default FeedbackPortal;
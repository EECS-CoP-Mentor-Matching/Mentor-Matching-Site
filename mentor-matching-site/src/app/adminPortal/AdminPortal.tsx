import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import "./AdminPortal.css";
import { Navigate, useNavigate } from 'react-router-dom';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import FeedbackAdminPortal from '../adminPortal/components/FeedbackAdminPortal/FeedbackAdminPortal';
import ManageUsers from '../adminPortal/components/manageUsers/ManageUsers';

import { FeedbackSettingsContext } from '../adminPortal/components/FeedbackSettings/FeedbackSettingsContext';

import { getSettings, updateSettings } from '../../service/settingsService';

import { MatchRole } from '../../types/matchProfile';

export enum Pages {
  manageUsers = "Manage Users",
  viewReports = "View Reports",
  settings = "Settings",
  userFeedback = "User Feedback"
}

interface AdminPortalProps {
}

function AdminPortal(props: AdminPortalProps) {

  const navigate = useNavigate();
  const [page, setPage] = useState(Pages.manageUsers.toString());

  // 1. Get the profile exactly like SideNav
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
  const userRole = userProfile?.preferences?.role;

  // 2. State for Admin Settings
  const [isTitleRequired, setIsTitleRequired] = useState(true);
  const [isContentRequired, setIsContentRequired] = useState(true);
  const [isTypeRequired, setIsTypeRequired] = useState(true);
  const [isAttachmentAllowed, setIsAttachmentAllowed] = useState(true);

  // 3. SECURE REDIRECT EFFECT
  // This mimics your SideNav logic to decide where the user belongs
  useEffect(() => {
    // Wait until profile exists
    if (!userProfile) return;

    // If NOT admin, redirect exactly like SideNav logic handles visibility
    if (userRole !== MatchRole.admin) {
      if (userRole === MatchRole.mentee || userRole === MatchRole.both) {
        navigate("/mentee-portal", { replace: true });
      } else if (userRole === MatchRole.mentor) {
        navigate("/mentor-portal", { replace: true });
      } else {
        // Fallback for logged in users with no valid role
        navigate("/login", { replace: true });
      }
    }
  }, [userProfile, userRole, navigate]);

  // 4. SETTINGS LOADING (Only for Admins)
  useEffect(() => {
    if (userRole !== MatchRole.admin) return;

    const fetchSettings = async () => {
      const settings = await getSettings();
      setIsTitleRequired(settings.isTitleRequired);
      setIsContentRequired(settings.isContentRequired);
      setIsTypeRequired(settings.isTypeRequired);
      setIsAttachmentAllowed(settings.isAttachmentAllowed);
    };
    fetchSettings();
  }, [userRole]);

  // 5. RENDER GUARDS
  if (!userProfile) return null; // Wait for Redux
  if (userRole !== MatchRole.admin) return null; // Don't show Admin UI to Mentees
  return (
    <>
 
        <FeedbackSettingsContext.Provider value={{
          isTitleRequired, setIsTitleRequired,
          isContentRequired, setIsContentRequired,
          isTypeRequired, setIsTypeRequired,
          isAttachmentAllowed, setIsAttachmentAllowed
        }}>

          <PortalNavigationBar selected={page} onNavChange={setPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
          {page === Pages.manageUsers && <ManageUsers />}
      {/* {page === Pages.viewReports && <ViewReports />} */}
      {/* {page === Pages.settings && <Settings />} */}
          {page === Pages.userFeedback && <div className="feedback-portal"><FeedbackAdminPortal /></div>}
       
        </FeedbackSettingsContext.Provider>

   </>
    
  );
}

export default AdminPortal;
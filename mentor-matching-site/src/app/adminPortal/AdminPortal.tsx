import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import "./AdminPortal.css";
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
import FeedbackAdminPortal from '../adminPortal/components/FeedbackAdminPortal/FeedbackAdminPortal';
import ManageUsers from '../adminPortal/components/manageUsers/ManageUsers';
import Settings from './components/settings/Settings';

import { FeedbackSettingsContext } from '../adminPortal/components/FeedbackSettings/FeedbackSettingsContext';
import { getSettings } from '../../service/settingsService';

export enum Pages {
  manageUsers = "Manage Users",
  viewReports = "View Reports",
  settings = "Settings",
  userFeedback = "User Feedback"
}

interface AdminPortalProps {}

function AdminPortal(props: AdminPortalProps) {
  const [page, setPage] = useState(Pages.manageUsers.toString());

  // 1. State for Admin Settings
  const [isTitleRequired, setIsTitleRequired] = useState(true);
  const [isContentRequired, setIsContentRequired] = useState(true);
  const [isTypeRequired, setIsTypeRequired] = useState(true);
  const [isAttachmentAllowed, setIsAttachmentAllowed] = useState(true);

  // 2. SETTINGS LOADING 
  // We no longer need to check if userRole !== admin because ProtectedRoute 
  // ensures only admins reach this component.
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getSettings();
        setIsTitleRequired(settings.isTitleRequired);
        setIsContentRequired(settings.isContentRequired);
        setIsTypeRequired(settings.isTypeRequired);
        setIsAttachmentAllowed(settings.isAttachmentAllowed);
      } catch (error) {
        console.error("Error loading admin settings:", error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <FeedbackSettingsContext.Provider value={{
      isTitleRequired, setIsTitleRequired,
      isContentRequired, setIsContentRequired,
      isTypeRequired, setIsTypeRequired,
      isAttachmentAllowed, setIsAttachmentAllowed
    }}>
      <PortalNavigationBar 
        selected={page} 
        onNavChange={setPage} 
        navItems={navUtilities.navItemsFromEnum(Pages)} 
      />
      
      {page === Pages.manageUsers && <ManageUsers />}
      {page === Pages.userFeedback && (
        <div className="feedback-portal">
          <FeedbackAdminPortal />
        </div>
      )}
      {/* {page === Pages.viewReports && <ViewReports />} */}
          {page === Pages.settings && <Settings />}
          {page === Pages.userFeedback && <div className="feedback-portal"><FeedbackAdminPortal /></div>}
       
    </FeedbackSettingsContext.Provider>
    
  );
}

export default AdminPortal;

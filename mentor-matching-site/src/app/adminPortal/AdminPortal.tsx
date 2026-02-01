import { useEffect, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import "./AdminPortal.css";
import { useNavigate } from 'react-router-dom';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';

import FeedbackAdminPortal from '../adminPortal/components/FeedbackAdminPortal/FeedbackAdminPortal';
import ManageUsers from '../adminPortal/components/manageUsers/ManageUsers';

import { FeedbackSettingsContext } from '../adminPortal/components/FeedbackSettings/FeedbackSettingsContext';

import { getSettings, updateSettings } from '../../service/settingsService';

import TopNav from "../nav/TopNav"; // Make sure to import
import SideNav from "../nav/SideNav"; // Make sure to import

export enum Pages {
  manageUsers = "Manage Users",
  viewReports = "View Reports",
  settings = "Settings",
  userFeedback = "User Feedback"
}

interface AdminPortalProps {
}

function AdminPortal(props: AdminPortalProps) {
  const [page, setPage] = useState(Pages.manageUsers.toString());
  //const navigate = useNavigate();


  const [isTitleRequired, setIsTitleRequired] = useState(true);
  const [isContentRequired, setIsContentRequired] = useState(true);
  const [isTypeRequired, setIsTypeRequired] = useState(true);
  const [isAttachmentAllowed, setIsAttachmentAllowed] = useState(true);

useEffect(() => {
    const fetchSettings = async () => {
      const settings = await getSettings();
      setIsTitleRequired(settings.isTitleRequired);
      setIsContentRequired(settings.isContentRequired);
      setIsTypeRequired(settings.isTypeRequired);
      setIsAttachmentAllowed(settings.isAttachmentAllowed);
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const saveSettings = async () => {
      await updateSettings({
        isTitleRequired,
        isContentRequired,
        isTypeRequired,
        isAttachmentAllowed
      });
    };
    saveSettings();
  }, [isTitleRequired, isContentRequired, isTypeRequired, isAttachmentAllowed]);
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  return (
    <>

        <FeedbackSettingsContext.Provider value={{
          isTitleRequired, setIsTitleRequired,
          isContentRequired, setIsContentRequired,
          isTypeRequired, setIsTypeRequired,
          isAttachmentAllowed, setIsAttachmentAllowed
        }}>

          <PortalNavigationBar selected={page} onNavChange={setPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
           <h3>Hello {userProfile?.contact?.displayName}</h3>
          {page === Pages.manageUsers && <ManageUsers />}
      {/* {page === Pages.viewReports && <ViewReports />} */}
      {/* {page === Pages.settings && <Settings />} */}
          {page === Pages.userFeedback && <div className="feedback-portal"><FeedbackAdminPortal /></div>}
       
        </FeedbackSettingsContext.Provider>
     
    </>
    
  );
}

export default AdminPortal;
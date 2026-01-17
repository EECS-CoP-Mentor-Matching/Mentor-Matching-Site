import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import CreateMenteeProfile from './components/createMenteeProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
import ActiveMenteeProfiles from './components/activeMenteeProfiles/ActiveMenteeProfiles';
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import { useNavigate } from 'react-router-dom';
import MenteeMessages from './components/menteeMessages/MenteeMessages';

export enum Pages {
  createProfile = "Create Profile",
  activeProfiles = "Active Profiles",
  menteeMessages = "Messages"
}

function MenteePortal() {
  // Ensure the state type is explicitly the Enum string value
  const [selectedPage, setSelectedPage] = useState<string>(Pages.activeProfiles.toString());

  const navigate = useNavigate();

  const backToActive = () => {
    setSelectedPage(Pages.activeProfiles.toString());
  }

  const backToCreate = () => {
    setSelectedPage(Pages.createProfile.toString());
  }
  
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  return (
    <>
      <AuthenticatedView>
        <div className="portal-container">
          {/* GATE: If userProfile is null, we show a loading state. 
            This prevents the sub-components from mounting with empty data, 
            which is why you were seeing a blank screen until refreshing.
          */}
          {!userProfile ? (
            <div className="loading-container" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3>Loading your profile...</h3>
            </div>
          ) : (
            <>
              <h3>Hello {userProfile?.contact?.displayName || "User"}</h3>
              
              <PortalNavigationBar 
                onNavChange={setSelectedPage} 
                selected={selectedPage} 
                navItems={navUtilities.navItemsFromEnum(Pages)} 
              />

              {/* Conditional Rendering Blocks */}
              {selectedPage === Pages.activeProfiles.toString() &&
                <div className="mentee-portal">
                  <ActiveMenteeProfiles backToPage={backToCreate} />
                </div>
              }

              {selectedPage === Pages.createProfile.toString() &&
                <div className="mentee-portal">
                  <CreateMenteeProfile backToPage={backToActive} />
                </div>
              }

              {selectedPage === Pages.menteeMessages.toString() &&
                <div className="mentee-portal">
                  <MenteeMessages backToPage={backToActive} />
                </div>
              }
            </>
          )}
        </div>
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default MenteePortal;
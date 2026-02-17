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
import FindMatches from './components/findMatches/FindMatches';

export enum Pages {
  // createProfile removed - now accessed via button
  activeProfiles = "Active Profiles",
  findMatches = "Find Matches",
  menteeMessages = "Messages"
}

function MenteePortal() {
  // Ensure the state type is explicitly the Enum string value
  const [selectedPage, setSelectedPage] = useState<string>(Pages.activeProfiles.toString());
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  const navigate = useNavigate();

  // Close create profile form when switching tabs
  const handleNavChange = (page: string) => {
    setShowCreateProfile(false);
    setSelectedPage(page);
  };

  const backToActive = () => {
    setShowCreateProfile(false);
    setSelectedPage(Pages.activeProfiles.toString());
  }
  
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  return (
    <>
      <AuthenticatedView>
        <div className="portal-container">
          
          {!userProfile ? (
            <div className="loading-container" style={{ padding: '2rem', textAlign: 'center' }}>
              <h3>Loading your profile...</h3>
            </div>
          ) : (
            <>

            <PortalNavigationBar 
              onNavChange={handleNavChange} 
              selected={selectedPage} 
              navItems={navUtilities.navItemsFromEnum(Pages)} 
            />

              {/* Conditional Rendering Blocks */}
              {selectedPage === Pages.activeProfiles.toString() && !showCreateProfile &&
                <div className="mentee-portal">
                  <ActiveMenteeProfiles 
                    backToPage={backToActive} 
                    onCreateProfile={() => setShowCreateProfile(true)} 
                  />
                </div>
              }

              {selectedPage === Pages.activeProfiles.toString() && showCreateProfile &&
                <div className="mentee-portal">
                  <CreateMenteeProfile backToPage={backToActive} />
                </div>
              }

              {selectedPage === Pages.findMatches.toString() && !showCreateProfile &&
                <div className="mentee-portal">
                  <FindMatches />
                </div>
              }

              {selectedPage === Pages.menteeMessages.toString() && !showCreateProfile &&
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

import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import CreateMenteeProfile from './components/createMenteeProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import ActiveMenteeProfiles from './components/activeMenteeProfiles/ActiveMenteeProfiles';
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import Messages from '../common/messaging/Messages';
import FindMatches from './components/findMatches/FindMatches';
import MyMentors from './components/myMentors/MyMentors';

export enum Pages {
  activeProfiles = "Active Profiles",
  myMentors = "My Mentors",
  findMatches = "Find Matches",
  menteeMessages = "Messages"
}

function MenteePortal() {
  const [selectedPage, setSelectedPage] = useState<string>(Pages.activeProfiles.toString());
  const [showCreateProfile, setShowCreateProfile] = useState(false);

  const userProfile = useAppSelector((state: any) => state.userProfile.userProfile);

  const handleNavChange = (page: string) => {
    setShowCreateProfile(false);
    setSelectedPage(page);
  };

  const backToActive = () => {
    setShowCreateProfile(false);
    setSelectedPage(Pages.activeProfiles.toString());
  };

  const goToFindMatches = () => setSelectedPage(Pages.findMatches.toString());

  const navItems = [
    Pages.activeProfiles.toString(),
    Pages.myMentors.toString(),
    Pages.findMatches.toString(),
    Pages.menteeMessages.toString()
  ];

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
                navItems={navItems}
              />

              {/* Active Profiles */}
              {selectedPage === Pages.activeProfiles.toString() && !showCreateProfile && (
                <div className="mentee-portal">
                  <ActiveMenteeProfiles
                    backToPage={backToActive}
                    onCreateProfile={() => setShowCreateProfile(true)}
                  />
                </div>
              )}

              {/* Create Profile - shown within Active Profiles tab */}
              {selectedPage === Pages.activeProfiles.toString() && showCreateProfile && (
                <div className="mentee-portal">
                  <CreateMenteeProfile backToPage={backToActive} />
                </div>
              )}

              {/* My Mentors */}
              {selectedPage === Pages.myMentors.toString() && (
                <div className="mentee-portal">
                  <MyMentors onFindMentors={goToFindMatches} />
                </div>
              )}

              {/* Find Matches */}
              {selectedPage === Pages.findMatches.toString() && (
                <div className="mentee-portal">
                  <FindMatches />
                </div>
              )}

              {/* Messages */}
              {selectedPage === Pages.menteeMessages.toString() && (
                <div className="mentee-portal">
                  <Messages userProfile={userProfile} adminView={false} />
                </div>
              )}
            </>
          )}
        </div>
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default MenteePortal;

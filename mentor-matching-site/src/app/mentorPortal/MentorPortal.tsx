import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import CreateMentorProfile from "./components/CreateMentorProfile";
import "./MentorPortal.css"
import PortalNavigationBar from "../common/navigation/PortalNavigationBar";
import ActiveProfiles from "../common/profiles/ActiveProfiles";
import MentorMatches from "./components/MentorMatches";
import MatchRequests from "./components/MatchRequests";
import MyMentees from "./components/MyMentees";
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';

export enum Pages {
  activeProfiles = "Active Profiles",
  createProfile = "Create Profile",
  pendingRequests = "Pending Requests",
  myMentees = "My Mentees",
  messages = "Messages"
}

function MentorPortal() {
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

  const navItems = [
    Pages.activeProfiles.toString(),
    Pages.pendingRequests.toString(),
    Pages.myMentees.toString(),
    Pages.messages.toString()
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
                <div className="mentor-portal">
                  <ActiveProfiles
                    userType="mentor"
                    backToPage={backToActive}
                    onCreateProfile={() => setShowCreateProfile(true)}
                  />
                </div>
              )}

              {/* Create Profile - shown within Active Profiles tab when button clicked */}
              {selectedPage === Pages.activeProfiles.toString() && showCreateProfile && (
                <div className="mentor-portal">
                  <CreateMentorProfile />
                </div>
              )}

              {/* Pending Requests */}
              {selectedPage === Pages.pendingRequests.toString() && (
                <div className="mentor-portal">
                  <MatchRequests />
                </div>
              )}

              {/* My Mentees */}
              {selectedPage === Pages.myMentees.toString() && (
                <div className="mentor-portal">
                  <MyMentees />
                </div>
              )}

              {/* Messages */}
              {selectedPage === Pages.messages.toString() && (
                <div className="mentor-portal">
                  <MentorMatches />
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

export default MentorPortal;

import { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import CreateMenteeProfile from './components/createMenteeProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
import ActiveMenteeProfiles from './components/activeMenteeProfiles/ActiveMenteeProfiles';
import ViewMatches from './components/activeMenteeProfiles/components/ViewMatches';
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import { useNavigate } from 'react-router-dom';
import MenteeMessages from './components/menteeMessages/MenteeMessages';
import TopNav from "../nav/TopNav"; // Make sure to import
import SideNav from "../nav/SideNav"; // Make sure to import
// in the match history, consolidate when multiple matches are made with the same mentor

export enum Pages {
  createProfile = "Create Profile",
  activeProfiles = "Active Profiles",
  menteeMessages = "Messages"
}

function MenteePortal() {
  const [selectedPage, setSelectedPage] = useState(Pages.activeProfiles.toString());

  const navigate = useNavigate();

  const backToActive = () => {
    setSelectedPage(Pages.activeProfiles);
  }

  const backToCreate = () => {
    setSelectedPage(Pages.createProfile);
  }
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  // if no profiles for the user
  return (
    <>
      <AuthenticatedView>
        <h3>Hello {userProfile?.contact?.displayName}</h3>
        <PortalNavigationBar onNavChange={setSelectedPage} selected={selectedPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
        {selectedPage === Pages.activeProfiles &&
          <div className="mentee-portal">
            <ActiveMenteeProfiles backToPage={backToCreate} />
          </div>
        }
        {selectedPage === Pages.createProfile &&
          <div className="mentee-portal">
            <CreateMenteeProfile backToPage={backToActive} />
          </div>
        }
        {selectedPage === Pages.menteeMessages &&
          <div className="mentee-portal">
            <MenteeMessages backToPage={backToActive} />
          </div>
        }
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default MenteePortal;
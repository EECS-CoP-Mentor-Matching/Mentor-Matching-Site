import { useState } from 'react';
import CreateMenteeProfile from './components/createMenteeProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
import ActiveMenteeProfiles from './components/activeMenteeProfiles/ActiveMenteeProfiles';
import ViewMatches from './components/viewMatches/ViewMatches';
// in the match history, consolidate when multiple matches are made with the same mentor

export enum Pages {
  createProfile = "Create Profile",
  activeProfiles = "Active Profiles"
}

function MenteePortal() {
  const [selectedPage, setSelectedPage] = useState(Pages.activeProfiles.toString());

  const backToActive = () => {
    setSelectedPage(Pages.activeProfiles);
  }

  // if no profiles for the user
  return (
    <>
      <PortalNavigationBar onNavChange={setSelectedPage} selected={selectedPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
      {selectedPage === Pages.activeProfiles &&
        <div className="mentee-portal">
          <ActiveMenteeProfiles />
        </div>
      }
      {selectedPage === Pages.createProfile &&
        <div className="mentee-portal">
          <CreateMenteeProfile backToPage={backToActive} />
        </div>
      }
    </>
  );
}

export default MenteePortal;
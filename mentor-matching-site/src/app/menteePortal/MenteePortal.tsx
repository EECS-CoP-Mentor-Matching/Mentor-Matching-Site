import { useEffect, useState } from 'react';
import CreateMenteeProfile from './components/createMenteeProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import { FormLabel } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';
// in the match history, consolidate when multiple matches are made with the same mentor

export enum Pages {
  activeProfiles = "Active Profiles",
  createProfile = "Create Profile",
  viewMatches = "View Matches"
}

function MenteePortal() {
  const [selectedPage, setSelectedPage] = useState(Pages.activeProfiles.toString());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      if (user === undefined) {
        navigate("/login");
      }
    }
    checkAuthState();
  });

  // if no profiles for the user
  return (
    <>
      <PortalNavigationBar onNavChange={setSelectedPage} selected={selectedPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
      {selectedPage === Pages.createProfile &&
        <div className="mentee-portal">
          <FormLabel>Profile 1</FormLabel>
          <CreateMenteeProfile />
        </div>
      }
      {selectedPage === Pages.activeProfiles &&
        <div className="mentee-portal">
          profiles...
        </div>
      }
      {selectedPage === Pages.viewMatches &&
        <div className="mentee-portal">
          matches...
        </div>
      }
    </>


  );
}

export default MenteePortal;
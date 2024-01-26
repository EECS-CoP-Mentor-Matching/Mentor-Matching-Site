import { useEffect, useState } from 'react';
import menteeService from '../../service/menteeService';
import CreateMenteeProfile from './components/createMenteeProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import { FormLabel } from "@mui/material"
import { type MatchProfile } from '../../types/matchProfile';
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

interface MenteePortalProps {

}

function MenteePortal(props: MenteePortalProps) {
  const [createProfile, setCreateProfile] = useState(false);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
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

  function showCreateProfile() {
    console.log("show");
    setCreateProfile(true);
  }

  function addProfile(newProfile: MatchProfile) {
    let newProfiles = profiles;
    newProfiles.push(newProfile);
    setProfiles(newProfiles);
  }

  function FetchInterests() {
    const read = async () => {
      const response = await menteeService.readInterests();
      console.log(response);
    }
    read();
  }

  // if no profiles for the user
  return (
    <>
      <PortalNavigationBar onNavChange={setSelectedPage} selected={selectedPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
      {selectedPage === Pages.createProfile &&
        <div className="mentee-portal">
          <FormLabel>Profile 1</FormLabel>
          <CreateMenteeProfile addProfile={addProfile} />
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
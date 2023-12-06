import { useEffect, useState } from 'react';
import menteeService from '../../service/menteeService';
import CreateMenteeProfile from './createProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import { FormLabel, Button } from "@mui/material"
import ViewMenteeProfile from './viewProfile/ViewMenteeProfile';
import { type MatchProfile } from '../../types';
import MenteePortalNav from './MenteePortalNav';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
// in the match history, consolidate when multiple matches are made with the same mentor

export enum Pages {
  activeProfiles,
  createProfile,
  viewMatches
}

interface MenteePortalProps {
  
}

function MenteePortal(props: MenteePortalProps) {
  const [createProfile, setCreateProfile] = useState(false);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [page, setPage] = useState(Pages.viewMatches)
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
      <MenteePortalNav setPage={setPage} />
      {page == Pages.createProfile &&
        <div className="mentee-portal">
          <FormLabel>Profile 1</FormLabel>
          <CreateMenteeProfile addProfile={addProfile} />
        </div>
      }
      {page == Pages.activeProfiles &&
        <div className="mentee-portal">
          profiles...
        </div>
      }
      {page == Pages.viewMatches &&
        <div className="mentee-portal">
          matches...
        </div>
      }
    </>

    
  );
}

export default MenteePortal;
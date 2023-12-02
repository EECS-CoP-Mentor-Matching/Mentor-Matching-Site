import { useState } from 'react';
import menteeService from '../../service/menteeService';
import CreateMenteeProfile from './createProfile/CreateMenteeProfile';
import "./MenteePortal.css"
import { FormLabel, Button } from "@mui/material"
import ViewMenteeProfile from './viewProfile/ViewMenteeProfile';
import { type MatchProfile } from '../../types';
// in the match history, consolidate when multiple matches are made with the same mentor

function MenteePortal() {
  const [createProfile, setCreateProfile] = useState(false);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);

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
      <ViewMenteeProfile />
      {!createProfile &&
        <div>
          <Button onClick={showCreateProfile}>Create New Match Profile</Button>
        </div>
      }
      {createProfile &&
        <div className="mentee-portal">
          <FormLabel>Profile 1</FormLabel>
          <CreateMenteeProfile addProfile={addProfile} />
        </div>
      }
    </>

    
  );
}

export default MenteePortal;
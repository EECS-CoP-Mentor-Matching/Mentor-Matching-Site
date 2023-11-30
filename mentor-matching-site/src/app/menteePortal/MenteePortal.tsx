import React from 'react';
import menteeService from '../../service/menteeService';
import MenteeProfile from './MenteeProfile';
import "./MenteePortal.css"
import { FormLabel } from "@mui/material"

// in the match history, consolidate when multiple matches are made with the same mentor

function MenteePortal() {
  function FetchInterests() {
    const read = async () => {
      const response = await menteeService.readInterests();
      console.log(response);
    }
    read();
  }

  // if no profiles for the user
  return (
    <div className="mentee-portal">
      <FormLabel>Profile 1</FormLabel>
      <MenteeProfile />
    </div>
  );
}

export default MenteePortal;
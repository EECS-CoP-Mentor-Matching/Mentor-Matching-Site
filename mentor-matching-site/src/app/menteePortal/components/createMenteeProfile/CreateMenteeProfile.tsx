import ExperienceLevel from "./components/ExperienceLevel";
import "./CreateMenteeProfile.css";
import SelectProfessionalInterest from "./components/SelectProfessionalInterest";
import SelectTechnicalInterest from "./components/SelectTechnicalInterest";
import { FormLabel, Button } from "@mui/material";
import { MatchProfile } from '../../../../types/matchProfile';
import { useState } from 'react';

interface CreateMenteeProfileProps {
  addProfile: (newProfile: MatchProfile) => void
}

function CreateMenteeProfile(props: CreateMenteeProfileProps) {
  const [technicalInterest, setTechnicalInterest] = useState('');
  const [technicalExperience, setTechnicalExperience] = useState(-1);
  const [professionalInterest, setProfessionalInterest] = useState('');
  const [professionalExperience, setProfessionalExperience] = useState(-1);

  return (
    <div className="mentee-profile">
      <FormLabel>Technical</FormLabel>
      <div className="mentee-interest">
        <SelectTechnicalInterest />
        <ExperienceLevel label="Experience Level" />
      </div>
      <FormLabel>Professional</FormLabel>
      <div className="mentee-interest">
        <SelectProfessionalInterest />
        <ExperienceLevel label="Experience Level" />
      </div>
      <Button onClick={() => {
        props.addProfile({
          UID: "Placeholder",
          technicalInterest: technicalInterest,
          technicalExperience: technicalExperience,
          professionalInterest: professionalInterest,
          professionalExperience: professionalExperience
        });
      }}>Add Profile</Button>
    </div>
  )
}

export default CreateMenteeProfile;
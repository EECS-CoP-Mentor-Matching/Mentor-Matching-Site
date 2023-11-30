import ExperienceLevel from "./ExperienceLevel";
import "./CreateMenteeProfile.css";
import SelectProfessionalInterest from "./SelectProfessionalInterest";
import SelectTechnicalInterest from "./SelectTechnicalInterest";
import { FormLabel, Button } from "@mui/material";
import { type Profile } from '../../../types';
import { useState } from 'react';

interface CreateMenteeProfileProps {
  addProfile: (newProfile: Profile) => void
}

function CreateMenteeProfile(props: CreateMenteeProfileProps) {
  const [technicalInterest, setTechnicalInterest] = useState('');
  const [technicalExperience, setTechnicalExperience] = useState('');
  const [professionalInterest, setProfessionalInterest] = useState('');
  const [professionalExperience, setProfessionalExperience] = useState('');

  return (
    <div className="mentee-profile">
      <FormLabel>Technical</FormLabel>
      <div className="mentee-interest">
        <SelectTechnicalInterest />
        <ExperienceLevel label="Experience Level"/>
      </div>
      <FormLabel>Professional</FormLabel>
      <div className="mentee-interest">
        <SelectProfessionalInterest />
        <ExperienceLevel label="Experience Level"/>
      </div>
      <Button onClick={() => {props.addProfile({
        technicalInterest: technicalInterest,
        technicalExperience: technicalExperience,
        professionalInterest: professionalInterest,
        professionalExperience: professionalExperience
      });}}>Add Profile</Button>
    </div>
  )
}

export default CreateMenteeProfile;
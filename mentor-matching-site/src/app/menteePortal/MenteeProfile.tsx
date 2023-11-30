import ExperienceLevel from "./ExperienceLevel";
import "./MenteeProfile.css";
import ProfessionalInterest from "./ProfessionalInterest";
import TechnicalInterest from "./TechnicalInterest";
import { FormLabel } from "@mui/material";

function MenteeProfile() {

  return (
    <div className="mentee-profile">
      <FormLabel>Technical</FormLabel>
      <div className="mentee-interest">
        <TechnicalInterest />
        <ExperienceLevel label="Experience Level"/>
      </div>
      <FormLabel>Professional</FormLabel>
      <div className="mentee-interest">
        <ProfessionalInterest />
        <ExperienceLevel label="Experience Level"/>
      </div>
    </div>
  )
}

export default MenteeProfile;
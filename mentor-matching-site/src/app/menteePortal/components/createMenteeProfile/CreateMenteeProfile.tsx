import ExperienceLevel from "../../../matchProfileCommon/ExperienceLevel";
import "./CreateMenteeProfile.css";
import SelectProfessionalInterest from "../../../matchProfileCommon/SelectProfessionalInterest";
import SelectTechnicalInterest from "../../../matchProfileCommon/SelectTechnicalInterest";
import { FormLabel, Button } from "@mui/material";
import { updateNewMenteeProfileProfessionalInterest, updateNewMenteeProfileTechnicalInterest } from "../../../../redux/reducers/matchProfileReducer";

function CreateMenteeProfile() {


  return (
    <div className="mentee-profile">
      <FormLabel>Technical</FormLabel>
      <div className="mentee-interest">
        <SelectTechnicalInterest onSelectDispatch={updateNewMenteeProfileTechnicalInterest} />
        <ExperienceLevel label="Experience Level" />
      </div>
      <FormLabel>Professional</FormLabel>
      <div className="mentee-interest">
        <SelectProfessionalInterest onSelectDispatch={updateNewMenteeProfileProfessionalInterest} />
        <ExperienceLevel label="Experience Level" />
      </div>
      <Button onClick={() => {
        // props.addProfile({
        //   UID: "Placeholder",
        //   technicalInterest: technicalInterest,
        //   technicalExperience: technicalExperience,
        //   professionalInterest: professionalInterest,
        //   professionalExperience: professionalExperience
        // });
      }}>Add Profile</Button>
    </div>
  )
}

export default CreateMenteeProfile;
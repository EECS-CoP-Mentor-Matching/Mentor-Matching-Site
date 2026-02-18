import { Checkbox, FormControlLabel, FormLabel } from "@mui/material";
import FormGroupCols from "../forms/layout/FormGroupCols";
import FormGroupRows from "../forms/layout/FormGroupRows";
import { UserProfile } from "../../../types/userProfile";
import SelectEducationLevel from "./SelectLevelOfEducation";
import SelectDegreeProgram from "./SelectDegreeProgram";

interface UpdateEducationInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;  
}

function UpdateEducationInformation({ showEdit, showEditStyle, userProfile, onChange}: UpdateEducationInformationProps) {
  //const educationInformation = selector(state => state.userProfile.userProfile.education);
  const educationInformation = userProfile.education;

   const updateEducationField = (
  field: keyof typeof educationInformation,
  value: any
) => {
  onChange({
    ...userProfile,
    education: {
      ...educationInformation,
      [field]: value
    }
  });
};

  return (
    <>{educationInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Education Information</FormLabel>
        <FormGroupRows>
          <SelectEducationLevel value={educationInformation.highestLevelOfEducation} onChange={(value) => updateEducationField("highestLevelOfEducation", value)} style={showEditStyle}/>
          <SelectDegreeProgram value={educationInformation.degreeProgram} onChange={(value) => updateEducationField("degreeProgram", value)} />
          <FormControlLabel control={<Checkbox checked={educationInformation.studentStatus} disabled={!showEdit} onChange={(e) => updateEducationField("studentStatus", e.target.checked)} />}
                      label="Currently a Student" />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateEducationInformation;
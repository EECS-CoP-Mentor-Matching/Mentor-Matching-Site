import { Checkbox, FormControlLabel, FormLabel } from "@mui/material";
import { updateDegreeProgram, updateEducationInformation, updateStudentStatus } from "../../../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import SelectLevelOfEducation from "../../../../userProfileCommon/dropdowns/SelectLevelOfEductation";
import SelectDegreeProgram from "../../../../userProfileCommon/dropdowns/SelectDegreeProgram";
import CheckboxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";
import { UserProfile } from "../../../../../types/userProfile";
import AdminSelectEducationLevel from "./AdminSelectLevelOfEducation";
import AdminSelectDegreeProgram from "./AdminSelectDegreeProgram";

interface UpdateEducationInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;  
}

function AdminUpdateEducationInformation({ showEdit, showEditStyle, userProfile, onChange}: UpdateEducationInformationProps) {
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
          <AdminSelectEducationLevel value={educationInformation.highestLevelOfEducation} onChange={(value) => updateEducationField("highestLevelOfEducation", value)}/>
          <AdminSelectDegreeProgram value={educationInformation.degreeProgram} onChange={(value) => updateEducationField("degreeProgram", value)} />
          <SelectDegreeProgram onSelectDispatch={updateDegreeProgram} currentValue={educationInformation.degreeProgram} />
          <FormControlLabel control={<Checkbox checked={educationInformation.studentStatus} disabled={!showEdit} onChange={(e) => updateEducationField("studentStatus", e.target.checked)} />}
                      label="Currently a Student" />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default AdminUpdateEducationInformation;
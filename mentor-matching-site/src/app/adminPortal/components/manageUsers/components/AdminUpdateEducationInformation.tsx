import { FormLabel } from "@mui/material";
import { updateDegreeProgram, updateEducationInformation, updateStudentStatus } from "../../../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import SelectLevelOfEducation from "../../../../userProfileCommon/dropdowns/SelectLevelOfEductation";
import SelectDegreeProgram from "../../../../userProfileCommon/dropdowns/SelectDegreeProgram";
import CheckboxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";
import { UserProfile } from "../../../../../types/userProfile";

interface UpdateEducationInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile
}

function AdminUpdateEducationInformation({ showEdit, showEditStyle, userProfile}: UpdateEducationInformationProps) {
  //const educationInformation = selector(state => state.userProfile.userProfile.education);
  const educationInformation = userProfile.education;

  return (
    <>{educationInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Education Information</FormLabel>
        <FormGroupRows>
          <SelectLevelOfEducation onSelectDispatch={updateEducationInformation} currentValue={educationInformation.highestLevelOfEducation} />
          <SelectDegreeProgram onSelectDispatch={updateDegreeProgram} currentValue={educationInformation.degreeProgram} />
          <CheckboxControlRedux onChangeDispatch={updateStudentStatus} checked={educationInformation.studentStatus} label="Currently a Student" />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default AdminUpdateEducationInformation;
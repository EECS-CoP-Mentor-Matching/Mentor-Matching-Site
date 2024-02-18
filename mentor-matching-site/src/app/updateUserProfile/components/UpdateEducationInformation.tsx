import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { updateDegreeProgram, updateEducationInformation, updateStudentStatus } from "../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../common/forms/layout/FormGroupRows";
import SelectLevelOfEducation from "../../userProfileCommon/dropdowns/SelectLevelOfEductation";
import SelectDegreeProgram from "../../userProfileCommon/dropdowns/SelectDegreeProgram";
import CheckboxControlRedux from "../../common/forms/checkbox/CheckBoxControlRedux";

interface UpdateEducationInformationProps {
  showEdit: boolean,
  showEditStyle: any
}

function UpdateEducationInformation({ showEdit, showEditStyle }: UpdateEducationInformationProps) {
  const selector = useAppSelector;
  const educationInformation = selector(state => state.profile.userProfile.education);

  return (
    <>{educationInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Education Information</FormLabel>
        <FormGroupRows>
          <SelectLevelOfEducation onSelectDispatch={updateEducationInformation} currentValue={educationInformation.highestLevelOfEducation} />
          <SelectDegreeProgram onSelectDispatch={updateDegreeProgram} currentValue={educationInformation.degreeProgram} />
          <CheckboxControlRedux checked={educationInformation.studentStatus} label="Currently a Student" onChangeDispatch={updateStudentStatus} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateEducationInformation;
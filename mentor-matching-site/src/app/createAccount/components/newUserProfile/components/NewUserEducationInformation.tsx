import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import { FormLabel, Select } from "@mui/material";
import SelectLevelOfEducation from "../../../../userProfileCommon/dropdowns/SelectLevelOfEductation";
import { updateHighestLevelOfEducation, updateStudentStatus } from "../../../../../redux/reducers/profileReducer";
import CheckBoxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";
import { useAppSelector } from "../../../../../redux/hooks";

function NewUserEducationInformation() {
  const selector = useAppSelector;
  const education = selector(state => state.profile.userProfile.education);

  return (
    <FormGroupCols>
      <FormLabel>User Eductation</FormLabel>
      <CheckBoxControlRedux label="Are you currently a student?" onChangeDispatch={updateStudentStatus} checked={education.studentStatus} />
      <SelectLevelOfEducation onSelectDispatch={updateHighestLevelOfEducation} currentValue={education.highestLevelOfEducation} />
    </FormGroupCols>
  );
}

export default NewUserEducationInformation;
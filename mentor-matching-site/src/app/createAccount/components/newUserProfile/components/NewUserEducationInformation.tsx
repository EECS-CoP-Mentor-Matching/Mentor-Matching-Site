import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import { FormLabel, Select } from "@mui/material";
import SelectLevelOfEducation from "../../../../userProfileCommon/dropdowns/SelectLevelOfEductation";
import { updateHighestLevelOfEducation, updateStudentStatus } from "../../../../../redux/reducers/profileReducer";
import CheckBoxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";

function NewUserEducationInformation() {

  return (
    <FormGroupCols>
      <FormLabel>User Eductation</FormLabel>
      <CheckBoxControlRedux label="Are you currently a student?" onChangeDispatch={updateStudentStatus} />
      <SelectLevelOfEducation onSelectDispatch={updateHighestLevelOfEducation} />
    </FormGroupCols>
  );
}

export default NewUserEducationInformation;
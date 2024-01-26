import { UserEducationInformation } from "../../../../../types/userProfile";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import { FormLabel, Select } from "@mui/material";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import CheckBoxControl from "../../../../common/forms/checkbox/CheckBoxControl";
import SelectLevelOfEducation from "../../../../userProfileCommon/dropdowns/SelectLevelOfEductation";

interface NewUserEducationInformationProps {
  educationInformation: UserEducationInformation
  setEducationInformation: (value: UserEducationInformation) => void
}

function NewUserEducationInformation(props: NewUserEducationInformationProps) {
  const setStudentStatus = (status: boolean) => {
    props.educationInformation.studentStatus = status;
    props.setEducationInformation(props.educationInformation);
  }

  const setLevelOfEductation = (level: string | undefined) => {
    if (level !== undefined) {
      props.educationInformation.highestLevelOfEducation = level;
      props.setEducationInformation(props.educationInformation);
    }
  }

  return (
    <FormGroupCols>
      <FormLabel>User Eductation</FormLabel>
      <CheckBoxControl label="Are you currently a student?"
        onChange={setStudentStatus}
        checked={props.educationInformation.studentStatus} />
      {/* <SelectLevelOfEducation onSelect={setLevelOfEductation} /> */}
    </FormGroupCols>
  );
}

export default NewUserEducationInformation;
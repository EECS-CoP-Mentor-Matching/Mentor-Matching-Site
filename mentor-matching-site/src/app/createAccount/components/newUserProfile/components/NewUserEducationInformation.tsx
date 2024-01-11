import { UserEducationInformation } from "../../../../types";
import FormGroupCols from "../../../common/FormGroupCols";
import { FormLabel } from "@mui/material";
import TextInputControl from "../../../common/TextInputControl";
import CheckboxControl from "../../../common/CheckboxControl";

interface NewUserEducationInformationProps {
  educationInformation: UserEducationInformation
  setEducationInformation: (value: UserEducationInformation) => void
}

function NewUserEducationInformation(props: NewUserEducationInformationProps) {
  function setStudentStatus(status: boolean) {
    props.educationInformation.studentStatus = status;
    props.setEducationInformation(props.educationInformation);
  }

  return (
    <FormGroupCols>
      <FormLabel>User Eductation</FormLabel>
      <CheckboxControl label="Are you a student?"
        onChange={setStudentStatus}
        checked={props.educationInformation.studentStatus}/>
    </FormGroupCols>
  );
}

export default NewUserEducationInformation;
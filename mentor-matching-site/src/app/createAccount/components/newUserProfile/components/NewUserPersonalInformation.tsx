import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import { useState } from "react";
import { UserPersonalInformation } from "../../../../../types/userProfile";
import { FormLabel } from "@mui/material";

interface NewUserPersonalInformationProps {
  personalInformation: UserPersonalInformation
  setPersonalInformation: (value: UserPersonalInformation) => void
}

function NewUserPersonalInformation(props: NewUserPersonalInformationProps) {
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <FormGroupCols>
      <FormLabel>User Personal Information</FormLabel>
      <FormGroupRows>
        <TextInputControl label="First Name" onInput={setFirstName} widthMulti={.25} />
        <TextInputControl label="Middle Name" onInput={setMiddleName} widthMulti={.25} />
      </FormGroupRows>
      <FormGroupRows>
        <TextInputControl label="Last Name" onInput={setLastName} widthMulti={.50} />
      </FormGroupRows>
    </FormGroupCols>
  );
}

export default NewUserPersonalInformation;
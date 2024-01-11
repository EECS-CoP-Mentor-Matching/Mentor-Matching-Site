import FormGroupCols from "../../../../common/forms/FormGroupCols";
import FormGroupRows from "../../../../common/forms/FormGroupRows";
import TextInputControl from "../../../../common/forms/TextInputControl";
import { useState } from "react";
import { UserPersonalInformation } from "../../../../../types";
import { FormLabel } from "@mui/material";

interface NewUserPersonalInformationProps {
  personalInformation: UserPersonalInformation
  setPersonalInformation: (value: UserPersonalInformation) => void
}

function NewUserPersonalInformation(props: NewUserPersonalInformationProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  return (
    <FormGroupCols>
      <FormLabel>User Personal Information</FormLabel>
      <FormGroupRows>
        <TextInputControl label="First Name" onInput={setFirstName} />
        <TextInputControl label="Last Name" onInput={setLastName} />
      </FormGroupRows>
      <TextInputControl label="Last Name" onInput={setLastName} />
    </FormGroupCols>
  );
}

export default NewUserPersonalInformation;
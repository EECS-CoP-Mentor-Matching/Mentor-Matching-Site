import { useState } from "react";
import FormGroupCols from "../../../../common/forms/FormGroupCols";
import TextInputControl from "../../../../common/forms/TextInputControl";
import { FormLabel } from "@mui/material";
import SelectTimeZone from "./SelectTimeZone";
import { UserContactInformation } from "../../../../../types";
import TextAreaControl from "../../../../common/forms/TextAreaControl";

interface NewUserContactInformationProps {
  contactInformation: UserContactInformation
  setContactInformation: (value: UserContactInformation) => void
}

function NewUserContactInformation(props: NewUserContactInformationProps) {
  function setDisplayName(value: string) {
    props.contactInformation.displayName = value;
    props.setContactInformation(props.contactInformation);
  }

  function setTimeZone(value: string | undefined) {
    props.contactInformation.timeZone = value != undefined ? value : '';
    props.setContactInformation(props.contactInformation);
  }

  function setPronouns(value: string) {
    props.contactInformation.pronouns = value;
    props.setContactInformation(props.contactInformation);
  }

  function setBio(value: string) {
    props.contactInformation.userBio = value;
    props.setContactInformation(props.contactInformation);
  }

  return (
    <FormGroupCols>
      <FormLabel>Welcome! Start by entering your contact information.</FormLabel>
      <div>Email: {props.contactInformation.email}</div>
      <SelectTimeZone onSelect={setTimeZone} />
      <TextInputControl label="Pronouns" onInput={setPronouns}
        value={props.contactInformation.pronouns} />
      <TextInputControl label="Display Name" onInput={setDisplayName}
        value={props.contactInformation.displayName} />
      <TextInputControl label="Bio" onInput={setBio}
        value={props.contactInformation.userBio} />
    </FormGroupCols>
  );
}

export default NewUserContactInformation;
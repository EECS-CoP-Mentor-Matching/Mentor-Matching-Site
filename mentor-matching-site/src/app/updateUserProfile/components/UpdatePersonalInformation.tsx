
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { UserPersonalInformation, initUserPersonalInformation } from "../../../types";
import FormGroupRows from "../../common/forms/FormGroupRows";
import TextInputControl from "../../common/forms/TextInputControl";
import { updateFirstName, updateLastName, updateMiddleName, updateDob } from "../../../redux/reducers/profileReducer";

interface UpdatePersonalInformationProps {
  showEdit: boolean
}

function UpdatePersonalInformation({ showEdit, }: UpdatePersonalInformationProps) {
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const personalInformation = selector(state => state.profile.userProfile.personal);

  const firstName = (firstName: string) => { dispatch(updateFirstName(firstName)); }
  const lastName = (firstName: string) => { dispatch(updateLastName(firstName)); }
  const middleName = (firstName: string) => { dispatch(updateMiddleName(firstName)); }

  return (
    <>{personalInformation != undefined &&
      <FormGroupRows>
        <TextInputControl value={personalInformation.firstName} label="First Name" readonly={!showEdit} onInput={firstName} />
        <TextInputControl value={personalInformation.middleName} label="Middle Name" readonly={!showEdit} onInput={middleName} />
        <TextInputControl value={personalInformation.lastName} label="Last Name" readonly={!showEdit} onInput={lastName} />
      </FormGroupRows>
    }</>
  );
}

export default UpdatePersonalInformation;
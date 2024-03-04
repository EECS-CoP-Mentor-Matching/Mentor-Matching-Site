import { useAppSelector } from "../../../../../redux/hooks";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import { FormLabel } from "@mui/material";
import TextInputControlRedux from "../../../../common/forms/textInputs/TextInputControlRedux";
import { updateDobDay, updateDobMonth, updateDobYear, updateFirstName, updateLastName, updateMiddleName } from "../../../../../redux/reducers/userProfileReducer";
import FormHeader from "../../../../common/forms/layout/FormHeader";

function NewUserPersonalInformation() {
  const selector = useAppSelector;
  const personalInformation = selector(state => state.userProfile.userProfile.personal);

  return (
    <FormGroupCols>
      <FormHeader>Personal Information</FormHeader>
      <FormGroupRows>
        <TextInputControlRedux value={personalInformation.firstName} label="First Name" onInputDispatch={updateFirstName} />
        <TextInputControlRedux value={personalInformation.middleName} label="Middle Name" onInputDispatch={updateMiddleName} />
        <TextInputControlRedux value={personalInformation.lastName} label="Last Name" onInputDispatch={updateLastName} />
      </FormGroupRows>
      <FormGroupRows>
        <FormLabel>Date of Birth</FormLabel>
        <TextInputControlRedux value={personalInformation.dob.month} onInputDispatch={updateDobMonth} widthMulti={.025} />/
        <TextInputControlRedux value={personalInformation.dob.day} onInputDispatch={updateDobDay} widthMulti={.025} />/
        <TextInputControlRedux value={personalInformation.dob.year} onInputDispatch={updateDobYear} widthMulti={.05} />
      </FormGroupRows>
    </FormGroupCols>
  );
}

export default NewUserPersonalInformation;
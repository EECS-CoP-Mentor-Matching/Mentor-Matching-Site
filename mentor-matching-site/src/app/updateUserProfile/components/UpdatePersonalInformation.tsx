import { useAppSelector } from "../../../redux/hooks";
import FormGroupRows from "../../common/forms/layout/FormGroupRows";
import { updateFirstName, updateLastName, updateMiddleName, updateDob, updateDobMonth, updateDobDay, updateDobYear } from "../../../redux/reducers/profileReducer";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";
import FormGroupCols from "../../common/forms/layout/FormGroupCols";
import { FormLabel } from "@mui/material";

interface UpdatePersonalInformationProps {
  showEdit: boolean,
  showEditStyle: any
}

function UpdatePersonalInformation({ showEdit, showEditStyle }: UpdatePersonalInformationProps) {
  const selector = useAppSelector;
  const personalInformation = selector(state => state.profile.userProfile.personal);

  return (
    <>{personalInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Personal Information</FormLabel>
        <FormGroupRows>
          <TextInputControlRedux value={personalInformation.firstName} label="First Name" readonly={!showEdit} onInputDispatch={updateFirstName} style={showEditStyle} />
          <TextInputControlRedux value={personalInformation.middleName} label="Middle Name" readonly={!showEdit} onInputDispatch={updateMiddleName} style={showEditStyle} />
          <TextInputControlRedux value={personalInformation.lastName} label="Last Name" readonly={!showEdit} onInputDispatch={updateLastName} style={showEditStyle} />
        </FormGroupRows>
        <FormGroupRows>
          <FormLabel>Date of Birth</FormLabel>
          <TextInputControlRedux value={personalInformation.dob.month} onInputDispatch={updateDobMonth} widthMulti={.025} />/
          <TextInputControlRedux value={personalInformation.dob.day} onInputDispatch={updateDobDay} widthMulti={.025} />/
          <TextInputControlRedux value={personalInformation.dob.year} onInputDispatch={updateDobYear} widthMulti={.05} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}

export default UpdatePersonalInformation;
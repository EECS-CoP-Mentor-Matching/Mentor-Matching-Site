import { useAppSelector } from "../../../redux/hooks";
import FormGroupRows from "../../common/forms/FormGroupRows";
import { updateFirstName, updateLastName, updateMiddleName, updateDob } from "../../../redux/reducers/profileReducer";
import TextInputControlRedux from "../../common/forms/TextInputControlRedux";
import FormGroupCols from "../../common/forms/FormGroupCols";
import { FormLabel } from "@mui/material";

interface UpdatePersonalInformationProps {
  showEdit: boolean
}

function UpdatePersonalInformation({ showEdit, }: UpdatePersonalInformationProps) {
  const selector = useAppSelector;
  const personalInformation = selector(state => state.profile.userProfile.personal);

  return (
    <>{personalInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Personal Information</FormLabel>
        <FormGroupRows>
          <TextInputControlRedux value={personalInformation.firstName} label="First Name" readonly={!showEdit} onInputDispatch={updateFirstName} />
          <TextInputControlRedux value={personalInformation.middleName} label="Middle Name" readonly={!showEdit} onInputDispatch={updateMiddleName} />
          <TextInputControlRedux value={personalInformation.lastName} label="Last Name" readonly={!showEdit} onInputDispatch={updateLastName} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={personalInformation.dob} label="Date of Birth" readonly={!showEdit} onInputDispatch={updateDob} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}

export default UpdatePersonalInformation;
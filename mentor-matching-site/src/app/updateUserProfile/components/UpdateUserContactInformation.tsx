import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { updateDisplayName, updateEmail, updatePronouns, updateTimeZone } from "../../../redux/reducers/profileReducer";
import FormGroupCols from "../../common/forms/FormGroupCols";
import FormGroupRows from "../../common/forms/FormGroupRows";
import TextInputControlRedux from "../../common/forms/TextInputControlRedux";

interface UpdateUserContactInformationProps {
  showEdit: boolean
}

function UpdateUserContactInformation({ showEdit }: UpdateUserContactInformationProps) {
  const selector = useAppSelector;
  const contactInformation = selector(state => state.profile.userProfile.contact);

  return (
    <>{contactInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Contact Information</FormLabel>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.email} label="Email" readonly={!showEdit} onInputDispatch={updateEmail} />
          <TextInputControlRedux value={contactInformation.displayName} label="Display Name" readonly={!showEdit} onInputDispatch={updateDisplayName} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.pronouns} label="Pronouns" readonly={!showEdit} onInputDispatch={updatePronouns} />
          <TextInputControlRedux value={contactInformation.timeZone} label="Time Zone" readonly={!showEdit} onInputDispatch={updateTimeZone} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserContactInformation;
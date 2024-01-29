import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { updateDisplayName, updateEmail, updatePronouns, updateTimeZone } from "../../../redux/reducers/profileReducer";
import FormGroupCols from "../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../common/forms/layout/FormGroupRows";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";
import TextDisplay from "../../common/forms/textInputs/TextDisplay";

interface UpdateUserContactInformationProps {
  showEdit: boolean,
  showEditStyle: any
}

function UpdateUserContactInformation({ showEdit, showEditStyle }: UpdateUserContactInformationProps) {
  const selector = useAppSelector;
  const contactInformation = selector(state => state.profile.userProfile.contact);

  return (
    <>{contactInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Contact Information</FormLabel>
        <FormGroupRows>
          <TextDisplay value={contactInformation.email} label="Email" widthMulti={.15} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.displayName} label="Display Name" readonly={!showEdit} onInputDispatch={updateDisplayName} style={showEditStyle} widthMulti={.15} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.pronouns} label="Pronouns" readonly={!showEdit} onInputDispatch={updatePronouns} style={showEditStyle} />
          <TextInputControlRedux value={contactInformation.timeZone} label="Time Zone" readonly={!showEdit} onInputDispatch={updateTimeZone} style={showEditStyle} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserContactInformation;
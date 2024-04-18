import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { updateDisplayName, updateEmail, updatePronouns, updateTimeZone } from "../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../common/forms/layout/FormGroupRows";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";
import TextDisplay from "../../common/forms/textInputs/TextDisplay";
import SelectTimeZone from "../../userProfileCommon/dropdowns/SelectTimeZone";

interface UpdateUserContactInformationProps {
  showEdit: boolean,
  showEditStyle: any
}

function UpdateUserContactInformation({ showEdit, showEditStyle }: UpdateUserContactInformationProps) {
  const selector = useAppSelector;
  const contactInformation = selector(state => state.userProfile.userProfile.contact);

  return (
    <>{contactInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Contact Information</FormLabel>
        <FormGroupRows>
          <TextDisplay label="Email" widthMulti={.15}>
            {contactInformation.email}
          </TextDisplay>
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.displayName} label="Display Name" readonly={!showEdit} onInputDispatch={updateDisplayName} style={showEditStyle} widthMulti={.15} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.pronouns} label="Pronouns" readonly={!showEdit} onInputDispatch={updatePronouns} style={showEditStyle} />
          <SelectTimeZone currentValue={contactInformation.timeZone} onSelectDispatch={updateTimeZone} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserContactInformation;
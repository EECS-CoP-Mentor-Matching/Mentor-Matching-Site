import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import { FormLabel } from "@mui/material";
import TextInputControlRedux from "../../../../common/forms/textInputs/TextInputControlRedux";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import { useAppSelector } from "../../../../../redux/hooks";
import { updateDisplayName, updatePronouns, updateTimeZone } from "../../../../../redux/reducers/userProfileReducer";
import SelectTimeZone from "../../../../userProfileCommon/dropdowns/SelectTimeZone";

function NewUserContactInformation() {
  const selector = useAppSelector;
  const contactInformation = selector(state => state.userProfile.userProfile.contact);

  return (
    <FormGroupCols>
      <FormLabel>Contact Information</FormLabel>
      <TextInputControl value={contactInformation.email} readonly={true} label="Email" widthMulti={.15} />
      <TextInputControlRedux value={contactInformation.displayName} label="Display Name" onInputDispatch={updateDisplayName} widthMulti={.15} />
      <TextInputControlRedux value={contactInformation.pronouns} label="Pronouns" onInputDispatch={updatePronouns} />
      <SelectTimeZone onSelectDispatch={updateTimeZone} currentValue={contactInformation.timeZone} />
    </FormGroupCols>
  );
}

export default NewUserContactInformation;
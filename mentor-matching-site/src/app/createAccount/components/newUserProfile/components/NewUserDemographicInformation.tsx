import { useAppSelector } from "../../../../../redux/hooks";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import { FormLabel } from "@mui/material";
import TextInputControlRedux from "../../../../common/forms/textInputs/TextInputControlRedux";
import CheckBoxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";
import SelectRacialIdentity from "../../../../userProfileCommon/dropdowns/SelectRacialIdentity";
import { updateLgbtqPlus, updateRacialIdentity } from "../../../../../redux/reducers/profileReducer";

function NewUserDemographicInformation() {
  const selector = useAppSelector;
  const demographicInformation = selector(state => state.profile.userProfile.demographics);

  return (
    <FormGroupCols>
      <FormLabel>User Demographics</FormLabel>
      <SelectRacialIdentity onSelectDispatch={updateRacialIdentity} currentValue={demographicInformation.racialIdentity} />
      <CheckBoxControlRedux label="Do you identify as a member of the LGBTQ+ Community?" onChangeDispatch={updateLgbtqPlus} checked={demographicInformation.lgbtqPlusCommunity} />
    </FormGroupCols>
  );
}

export default NewUserDemographicInformation;
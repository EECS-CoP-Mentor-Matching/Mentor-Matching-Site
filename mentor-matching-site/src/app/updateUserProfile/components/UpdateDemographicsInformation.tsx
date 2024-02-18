import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { updateLgbtqPlus, updateRacialIdentity } from "../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../common/forms/layout/FormGroupRows";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";
import SelectRacialIdentity from "../../userProfileCommon/dropdowns/SelectRacialIdentity";

interface UpdateUserDemographicInformationProps {
  showEdit: boolean
  showEditStyle: any
}

function UpdateUserDemographicInformation({ showEdit, showEditStyle }: UpdateUserDemographicInformationProps) {
  const selector = useAppSelector;
  const demographicInformation = selector(state => state.userProfile.userProfile.demographics);

  return (
    <>{demographicInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Demographic Information</FormLabel>
        <FormGroupRows>
          <TextInputControlRedux value={demographicInformation.lgbtqPlusCommunity ? 'Yes' : 'No'} label="Identify as LGBTQ+" readonly={!showEdit} onInputDispatch={updateLgbtqPlus} style={showEditStyle} />
          <SelectRacialIdentity currentValue={demographicInformation.racialIdentity} onSelectDispatch={updateRacialIdentity} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserDemographicInformation;
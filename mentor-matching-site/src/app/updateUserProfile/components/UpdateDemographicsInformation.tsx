import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import { updateLgbtqPlus, updateRacialIdentity } from "../../../redux/reducers/profileReducer";
import FormGroupCols from "../../common/forms/FormGroupCols";
import FormGroupRows from "../../common/forms/FormGroupRows";
import TextInputControlRedux from "../../common/forms/TextInputControlRedux";

interface UpdateUserDemographicInformationProps {
  showEdit: boolean
  showEditStyle: any
}

function UpdateUserDemographicInformation({ showEdit, showEditStyle }: UpdateUserDemographicInformationProps) {
  const selector = useAppSelector;
  const demographicInformation = selector(state => state.profile.userProfile.demographics);

  return (
    <>{demographicInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Demographic Information</FormLabel>
        <FormGroupRows>
          <TextInputControlRedux value={demographicInformation.lgbtqPlusCommunity ? 'Yes' : 'No'} label="Identify as LGBTQ+" readonly={!showEdit} onInputDispatch={updateLgbtqPlus} style={showEditStyle} />
          <TextInputControlRedux value={demographicInformation.racialIdentity} label="Racial Identity" readonly={!showEdit} onInputDispatch={updateRacialIdentity} style={showEditStyle} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserDemographicInformation;
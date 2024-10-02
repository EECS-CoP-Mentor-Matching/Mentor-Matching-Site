import { FormLabel } from "@mui/material";
import { useAppSelector } from "../../../redux/hooks";
import {updateLgbtqPlus, updateRacialIdentity, updateRole} from "../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../common/forms/layout/FormGroupRows";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";
import SelectRacialIdentity from "../../userProfileCommon/dropdowns/SelectRacialIdentity";
import CheckBoxControlRedux from "../../common/forms/checkbox/CheckBoxControlRedux";
import SelectRole from "../../userProfileCommon/dropdowns/SelectRole";

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
          <SelectRole onSelectDispatch={updateRole} currentValue={demographicInformation.role} />
          <CheckBoxControlRedux checked={demographicInformation.lgbtqPlusCommunity} label="Identify as LGBTQ+" readOnly={!showEdit} onChangeDispatch={updateLgbtqPlus} />
          <SelectRacialIdentity currentValue={demographicInformation.racialIdentity} onSelectDispatch={updateRacialIdentity} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserDemographicInformation;
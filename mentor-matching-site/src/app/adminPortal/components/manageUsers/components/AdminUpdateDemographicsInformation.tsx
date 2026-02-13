import { FormLabel } from "@mui/material";
import {updateLgbtqPlus, updateRacialIdentity, updateRole} from "../../../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import SelectRacialIdentity from "../../../../userProfileCommon/dropdowns/SelectRacialIdentity";
import CheckBoxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";
import SelectRole from "../../../../userProfileCommon/dropdowns/SelectRole";
import { UserProfile } from "../../../../../types/userProfile";
import { Checkbox, FormControlLabel } from "@mui/material";
import AdminSelectRacialIdentity from "./AdminSelectRacialIdentity";

interface UpdateUserDemographicInformationProps {
  showEdit: boolean
  showEditStyle: any
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;
}

function AdminUpdateUserDemographicInformation({ showEdit, showEditStyle, userProfile, onChange }: UpdateUserDemographicInformationProps) {
  //const demographicInformation = selector(state => state.userProfile.userProfile.demographics);
  // *** FIX 1: ADD SELECTOR FOR USER PREFERENCES ***
  //const userPreferences = selector(state => state.userProfile.userProfile.preferences);
  const demographicInformation = userProfile.demographics;
  const userPreferences = userProfile.preferences;

 const updateDemographicField = (
  field: keyof typeof demographicInformation,
  value: any
) => {
  onChange({
    ...userProfile,
    demographics: {
      ...demographicInformation,
      [field]: value
    }
  });
};


  return (
    <>{demographicInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Demographic Information</FormLabel>
        <FormGroupRows>
          {/* FIX 2: Corrected line from previous steps */}
          <SelectRole onSelectDispatch={updateRole} currentValue={userPreferences.role} />
          <FormControlLabel control={<Checkbox checked={demographicInformation.lgbtqPlusCommunity} disabled={!showEdit} onChange={(e) => updateDemographicField("lgbtqPlusCommunity", e.target.checked)} />}
            label="Identify as LGBTQ+" />
          <AdminSelectRacialIdentity value={demographicInformation.racialIdentity} onChange={(value) => updateDemographicField("racialIdentity", value)}/>
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default AdminUpdateUserDemographicInformation;
import { FormLabel } from "@mui/material";
import { updateLgbtqPlus, updateRacialIdentity, updateRole } from "../../../redux/reducers/userProfileReducer";
import FormGroupCols from "../forms/layout/FormGroupCols";
import FormGroupRows from "../forms/layout/FormGroupRows";
import SelectRole from "./SelectRole";
import { UserProfile } from "../../../types/userProfile";
import { Checkbox, FormControlLabel } from "@mui/material";
import SelectRacialIdentity from "./SelectRacialIdentity";
import { useAppSelector } from "../../../redux/hooks";

interface UpdateUserDemographicInformationProps {
  showEdit: boolean
  showEditStyle: any
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;
}

function UpdateUserDemographicInformation({ showEdit, showEditStyle, userProfile, onChange }: UpdateUserDemographicInformationProps) {
  const demographicInformation = userProfile.demographics;
  const userPreferences = userProfile.preferences;

  // Check if the LOGGED-IN user is an Admin (not the profile being edited)
  const currentLoggedInUser = useAppSelector((state) => state.userProfile.userProfile);
  const isLoggedInUserAdmin = currentLoggedInUser?.preferences?.role === "Admin";

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

  const updatePreferenceField = (
    field: keyof typeof userPreferences,
    value: any
  ) => {
    onChange({
      ...userProfile,
      preferences: {
        ...userPreferences,
        [field]: value
      }
    });
  };

  return (
    <>{demographicInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Demographic Information</FormLabel>
        <FormGroupRows>
          {/* Show Admin option if the logged-in user is an Admin */}
          <SelectRole 
            value={userPreferences.role} 
            onChange={(value) => updatePreferenceField("role", value)}
            allowAdmin={isLoggedInUserAdmin}
          />
          <FormControlLabel 
            control={
              <Checkbox 
                checked={demographicInformation.lgbtqPlusCommunity} 
                disabled={!showEdit} 
                onChange={(e) => updateDemographicField("lgbtqPlusCommunity", e.target.checked)} 
              />
            }
            label="Identify as LGBTQ+" 
          />
          <SelectRacialIdentity 
            value={demographicInformation.racialIdentity} 
            onChange={(value) => updateDemographicField("racialIdentity", value)}
          />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}

export default UpdateUserDemographicInformation;

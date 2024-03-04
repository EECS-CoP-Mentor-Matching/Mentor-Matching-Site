import { useAppSelector } from "../../../../../redux/hooks";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import CheckBoxControlRedux from "../../../../common/forms/checkbox/CheckBoxControlRedux";
import SelectRacialIdentity from "../../../../userProfileCommon/dropdowns/SelectRacialIdentity";
import { updateLgbtqPlus, updateRacialIdentity, updateUseLgbtqPlusCommunityForMatching, updateUseRacialIdentityForMatching } from "../../../../../redux/reducers/userProfileReducer";
import FormHeader from "../../../../common/forms/layout/FormHeader";
import FormSectionHeader from "../../../../common/forms/layout/FormSectionHeader";

function NewUserDemographicInformation() {
  const selector = useAppSelector;
  const demographicInformation = selector(state => state.userProfile.userProfile.demographics);
  const userPreferences = selector(state => state.userProfile.userProfile.preferences);

  return (
    <FormGroupCols>
      <FormHeader>User Demographics</FormHeader>
      <FormGroupCols>
        <FormSectionHeader>Racial Identity</FormSectionHeader>
        <SelectRacialIdentity onSelectDispatch={updateRacialIdentity} currentValue={demographicInformation.racialIdentity} />
        <CheckBoxControlRedux label="Would you like to use this information for matching?" onChangeDispatch={updateUseRacialIdentityForMatching} checked={userPreferences.useRacialIdentityForMatching} />
      </FormGroupCols>
      <FormGroupCols>
        <FormSectionHeader>LGBTQ+ Community</FormSectionHeader>
        <CheckBoxControlRedux label="Do you identify as a member of the LGBTQ+ Community?" onChangeDispatch={updateLgbtqPlus} checked={demographicInformation.lgbtqPlusCommunity} />
        <CheckBoxControlRedux label="Would you like to use this information for matching?" onChangeDispatch={updateUseLgbtqPlusCommunityForMatching} checked={userPreferences.useLgbtqPlusCommunityForMatching} />
      </FormGroupCols>
    </FormGroupCols>
  );
}

export default NewUserDemographicInformation;
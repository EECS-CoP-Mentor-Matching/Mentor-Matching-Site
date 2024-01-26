import { UserDemographicInformation } from "../../../../../types/userProfile";
import CheckBoxControl from "../../../../common/forms/checkbox/CheckBoxControl";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import { FormLabel } from "@mui/material";

interface NewUserDemographicInformationProps {
  demographicInformation: UserDemographicInformation
  setDemographicInformation: (value: UserDemographicInformation) => void
}

function NewUserDemographicInformation(props: NewUserDemographicInformationProps) {
  function setRacialIdentity(value: string) {
    props.demographicInformation.racialIdentity = value;
    props.setDemographicInformation(props.demographicInformation);
  }

  function setLgbtqPlusCommunity(value: boolean) {
    props.demographicInformation.lgbtqPlusCommunity = value;
    props.setDemographicInformation(props.demographicInformation);
  }

  return (
    <FormGroupCols>
      <FormLabel>User Demographics</FormLabel>
      <TextInputControl label="Racial Identity" onInput={setRacialIdentity}
        value={props.demographicInformation.racialIdentity} widthMulti={.15} />
      <CheckBoxControl label="Do you identify as a member of the LGBTQ+ Community?" onChange={setLgbtqPlusCommunity}
        checked={props.demographicInformation.lgbtqPlusCommunity} />
    </FormGroupCols>
  );
}

export default NewUserDemographicInformation;
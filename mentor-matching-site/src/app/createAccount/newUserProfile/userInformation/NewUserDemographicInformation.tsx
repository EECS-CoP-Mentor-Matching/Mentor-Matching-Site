import { UserDemographicInformation } from "../../../../types";
import CheckboxControl from "../../../common/CheckboxControl";
import FormGroupCols from "../../../common/FormGroupCols";
import TextInputControl from "../../../common/TextInputControl";
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
        value={props.demographicInformation.racialIdentity} />
      <CheckboxControl label="Do you identify as a member of the LGBTQ+ Community?" onChange={setLgbtqPlusCommunity} 
        checked={props.demographicInformation.lgbtqPlusCommunity} />
    </FormGroupCols>
  );
}

export default NewUserDemographicInformation;
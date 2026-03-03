import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import {DropDownOption} from "../../../types/types";
import { CREDENTIALS } from "../../../config/matchingConfig";

interface SelectCredentialsProps {
  onSelectDispatch(payload: any): {
    payload: any;
    type: string;
  };
  currentValue?: string;
}

function SelectCredentials({ onSelectDispatch, currentValue }: SelectCredentialsProps) {
  const mapOptions = (): DropDownOption[] => {
    return CREDENTIALS.map(credential => ({
      label: credential,
      id: credential
    }));
  };

  return (
      <DropDownControlLoaderRedux
          label="Credentials *"
          onSelectDispatch={onSelectDispatch}
          selectedValue={currentValue}
          mappingMethod={mapOptions}
          dbSearchAsync={async () => mapOptions()}
          valueIs="label"
      />
  );
}

export default SelectCredentials;

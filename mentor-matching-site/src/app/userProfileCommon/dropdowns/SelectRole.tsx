import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import {DropDownOption} from "../../../types/types";
import {MatchRole} from "../../../types/matchProfile";

interface SelectRoleProps {
  onSelectDispatch(payload: any): {
    payload: any;
    type: string;
  };
  currentValue?: string;
}

function SelectRole({ onSelectDispatch, currentValue }: SelectRoleProps) {
  const mapOptions = (): DropDownOption[] => {
    return Object.values(MatchRole).map(role => ({
      label: role,
      id: role
    }));
  };

  return (
      <DropDownControlLoaderRedux
          label="Select Role"
          onSelectDispatch={onSelectDispatch}
          selectedValue={currentValue}
          mappingMethod={mapOptions}
          dbSearchAsync={async () => mapOptions()}
          valueIs="label"
      />
  );
}

export default SelectRole;
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import {DropDownOption} from "../../../types/types";
import { COLLEGE_YEARS } from "../../../config/matchingConfig";

interface SelectCollegeYearProps {
  onSelectDispatch(payload: any): {
    payload: any;
    type: string;
  };
  currentValue?: string;
}

function SelectCollegeYear({ onSelectDispatch, currentValue }: SelectCollegeYearProps) {
  const mapOptions = (): DropDownOption[] => {
    return COLLEGE_YEARS.map(year => ({
      label: year,
      id: year
    }));
  };

  return (
      <DropDownControlLoaderRedux
          label="College Year *"
          onSelectDispatch={onSelectDispatch}
          selectedValue={currentValue}
          mappingMethod={mapOptions}
          dbSearchAsync={async () => mapOptions()}
          valueIs="label"
      />
  );
}

export default SelectCollegeYear;

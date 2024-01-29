import selectionItemsDb from "../../../dal/selectionItemsDb";
import { EducationLevel } from "../../../types/matchProfile";
import { DropDownOption } from "../../../types/types";
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectLevelOfEducationProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectLevelOfEducation({ onSelectDispatch, currentValue }: SelectLevelOfEducationProps) {

  const mapOptions = ((levels: EducationLevel[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    levels.forEach(currLevel => {
      options.push({
        label: currLevel.level,
        id: currLevel.hierarchy
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux label="Level of Education"
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={selectionItemsDb.educationLevelsAsync}
      mappingMethod={mapOptions}
      selectedOption={currentValue}
    />
  );
}

export default SelectLevelOfEducation;
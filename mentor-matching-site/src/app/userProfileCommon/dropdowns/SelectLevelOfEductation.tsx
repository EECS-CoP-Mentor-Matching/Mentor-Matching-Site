import selectionItemsDb from "../../../dal/selectionItemsDb";
import { EducationLevel } from "../../../types/matchProfile";
import { DocItem, DropDownOption } from "../../../types/types";
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectLevelOfEducationProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectLevelOfEducation({ onSelectDispatch, currentValue }: SelectLevelOfEducationProps) {

  const mapOptions = ((edLevels: DocItem<EducationLevel>[]): DropDownOption[] => {
    const loadOptions = new Array<DropDownOption>;
    edLevels.forEach(edLevel => {
      loadOptions.push({
        label: edLevel.data.level,
        id: edLevel.docId
      });
    });
    return loadOptions;
  });

  return (
    <DropDownControlLoaderRedux
      label="Level of Education"
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={selectionItemsDb.educationLevelsAsync}
      mappingMethod={mapOptions}
      selectedValue={currentValue}
      valueIs="label"
    />
  );
}

export default SelectLevelOfEducation;
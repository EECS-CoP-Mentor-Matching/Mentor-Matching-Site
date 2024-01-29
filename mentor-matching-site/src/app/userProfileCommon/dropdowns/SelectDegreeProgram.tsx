import { DegreeProgram } from "../../../types/userProfile";
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import DropDownControlRedux from "../../common/forms/dropDowns/DropDownControlRedux";
import { DropDownOption } from "../../../types/types";
import selectionItemsDb from "../../../dal/selectionItemsDb";

interface SelectDegreeProgramProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectDegreeProgram({ onSelectDispatch, currentValue }: SelectDegreeProgramProps) {

  const mapOptions = ((levels: DegreeProgram[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    levels.forEach(currLevel => {
      options.push({
        label: currLevel.degreeProgramName,
        id: currLevel.id
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux
      label="Degree Program"
      onSelectDispatch={onSelectDispatch}
      selectedOption={currentValue}
      mappingMethod={mapOptions}
      dbSearchAsync={selectionItemsDb.degreeProgramsAsync}
    />
  );
}

export default SelectDegreeProgram;
import { DegreeProgram } from "../../../types/userProfile";
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";
import DropDownControlRedux from "../../common/forms/dropDowns/DropDownControlRedux";
import { DocItem, DropDownOption } from "../../../types/types";
import selectionItemsDb from "../../../dal/selectionItemsDb";

// TODO: These files can not yet be refactored to match the new Edit User forms in /src/app/common/manageUsers
// because the forms for creating a new user account still depend on them.  Leaving them as-is for now.

interface SelectDegreeProgramProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectDegreeProgram({ onSelectDispatch, currentValue }: SelectDegreeProgramProps) {

  const mapOptions = ((levels: DocItem<DegreeProgram>[]): DropDownOption[] => {
    const options = new Array<DropDownOption>();
    levels.forEach(currLevel => {
      options.push({
        label: currLevel.data.degreeProgramName,
        id: currLevel.docId
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux
      label="Degree Program"
      onSelectDispatch={onSelectDispatch}
      selectedValue={currentValue}
      mappingMethod={mapOptions}
      dbSearchAsync={selectionItemsDb.degreeProgramsAsync}
      valueIs="label"
    />
  );
}

export default SelectDegreeProgram;
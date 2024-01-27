import selectionItemsDb from "../../../dal/selectionItemsDb";
import { TimeZone } from "../../../types/userProfile";
import { DropDownOption } from "../../../types/types";
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectTimeZoneProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectTimeZone({ onSelectDispatch, currentValue }: SelectTimeZoneProps) {
  const mapOptions = ((levels: TimeZone[]): DropDownOption[] => {
    const options = new Array<DropDownOption>;
    levels.forEach(currLevel => {
      options.push({
        label: currLevel.timeZoneName,
        id: currLevel.id
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={selectionItemsDb.timeZonesAsync}
      mappingMethod={mapOptions}
      selectedOption={currentValue}
      label="Time Zone"
    />
  );
}

export default SelectTimeZone;
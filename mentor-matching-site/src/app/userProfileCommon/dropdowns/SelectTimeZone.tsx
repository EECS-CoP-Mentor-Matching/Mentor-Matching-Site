import selectionItemsDb from "../../../dal/selectionItemsDb";
import { TimeZone } from "../../../types/userProfile";
import { DocItem, DropDownOption } from "../../../types/types";
import DropDownControlLoaderRedux from "../../common/forms/dropDowns/DropDownControlLoaderRedux";

interface SelectTimeZoneProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectTimeZone({ onSelectDispatch, currentValue }: SelectTimeZoneProps) {
  const mapOptions = ((levels: DocItem<TimeZone>[]): DropDownOption[] => {
    const options = new Array<DropDownOption>();
    levels.forEach(currLevel => {
      options.push({
        label: currLevel.data.timeZoneName,
        id: currLevel.docId
      } as DropDownOption);
    });
    return options;
  });

  return (
    <DropDownControlLoaderRedux
      onSelectDispatch={onSelectDispatch}
      dbSearchAsync={selectionItemsDb.timeZonesAsync}
      mappingMethod={mapOptions}
      selectedValue={currentValue}
      label="Time Zone"
      valueIs="label"
    />
  );
}

export default SelectTimeZone;
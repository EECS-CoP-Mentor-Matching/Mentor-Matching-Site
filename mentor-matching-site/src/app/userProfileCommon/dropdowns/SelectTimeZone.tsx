import DropDownControlRedux from "../../common/forms/dropDowns/DropDownControlRedux";

interface SelectTimeZoneProps {
  onSelectDispatch(payload: any): {
    payload: any
    type: string
  }
  currentValue?: string
}

function SelectTimeZone({ onSelectDispatch, currentValue }: SelectTimeZoneProps) {
  const timeZones = [
    { label: 'EST', id: 1 },
    { label: 'PST', id: 2 },
    { label: 'CST', id: 3 },
  ]

  return (
    <DropDownControlRedux label="Time Zone"
      options={timeZones}
      onSelectDispatch={onSelectDispatch}
      selectedOption={currentValue}
    />
  );
}

export default SelectTimeZone;
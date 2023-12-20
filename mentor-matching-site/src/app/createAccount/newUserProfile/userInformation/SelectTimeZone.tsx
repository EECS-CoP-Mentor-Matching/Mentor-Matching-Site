import DropDownControl from "../../../common/DropDownControl";

interface SelectTimeZoneProps {
  onSelect: (value: string | undefined) => void
}

function SelectTimeZone(props: SelectTimeZoneProps) {
  const timeZones = [
    { label: 'EST', id: 1 },
    { label: 'PST', id: 2 },
    { label: 'CST', id: 3 },
  ]

  return (
    <DropDownControl inputLabel="Timezone" 
      options={timeZones} 
      onSelect={props.onSelect}
    />
  );
}

export default SelectTimeZone;
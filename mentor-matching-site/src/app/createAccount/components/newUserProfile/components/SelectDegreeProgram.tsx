import DropDownControl from "../../../../common/forms/DropDownControl";

interface SelectDegreeProgramProps {
  onSelect: (value: string | undefined) => void
}

function SelectDegreeProgram(props: SelectDegreeProgramProps) {
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

export default SelectDegreeProgram;
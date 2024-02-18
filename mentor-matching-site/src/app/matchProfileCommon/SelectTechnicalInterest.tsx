import DropDownControl from "../common/forms/dropDowns/DropDownControl";

function SelectTechnicalInterest() {
  const technicalInterest = [
    { label: '.NET', id: 1 },
    { label: 'Software Engineering', id: 2 },
    { label: 'Electrical Engineering', id: 3 },
    { label: 'AutoCad', id: 4 }
  ];

  return (
    <DropDownControl label="Interests" options={technicalInterest} onSelect={() => { }} />
  );
}

export default SelectTechnicalInterest;
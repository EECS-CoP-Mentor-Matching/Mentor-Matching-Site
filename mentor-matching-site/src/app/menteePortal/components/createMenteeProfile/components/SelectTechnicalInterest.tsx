import DropDownControl from "../../../../common/forms/DropDownControl";

function SelectTechnicalInterest() {
  const technicalInterest = [
    { label: '.NET', id: 1 },
    { label: 'Software Engineering', id: 2 },
    { label: 'Electrical Engineering', id: 3 },
    { label: 'AutoCad', id: 4 }
  ];

  return (
    <DropDownControl inputLabel="Interests" options={technicalInterest} onSelect={() => { }} />
  );
}

export default SelectTechnicalInterest;
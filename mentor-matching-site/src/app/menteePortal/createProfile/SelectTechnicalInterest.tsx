import SelectInterest from "./SelectInterest";

function SelectTechnicalInterest() {
  const technicalInterest = [
    { label: '.NET', id: 1},
    { label: 'Software Engineering', id: 2},
    { label: 'Electrical Engineering', id: 3},
    { label: 'AutoCad', id: 4}
  ];

  return (
    <SelectInterest options={technicalInterest} />
  );
}

export default SelectTechnicalInterest;
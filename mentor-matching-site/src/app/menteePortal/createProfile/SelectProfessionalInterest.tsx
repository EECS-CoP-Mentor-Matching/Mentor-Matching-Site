import { TextField, Autocomplete } from "@mui/material";
import SelectInterest from "./SelectInterest";

function SelectProfessionalInterest() {
  const professionalInterests = [
    { label: 'Resume', id: 1 },
    { label: 'Interviews', id: 1 },
    { label: 'Job Applications', id: 1 },
  ]

  return (
    <SelectInterest options={professionalInterests} />
  );
}

export default SelectProfessionalInterest;
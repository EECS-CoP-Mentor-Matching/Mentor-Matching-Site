import { TextField, Autocomplete } from "@mui/material";
import DropDownControl from "../../../../common/forms/DropDownControl";

function SelectProfessionalInterest() {
  const professionalInterests = [
    { label: 'Resume', id: 1 },
    { label: 'Interviews', id: 1 },
    { label: 'Job Applications', id: 1 },
  ]

  return (
    <DropDownControl inputLabel="Interests" options={professionalInterests} onSelect={() => { }} />
  );
}

export default SelectProfessionalInterest;
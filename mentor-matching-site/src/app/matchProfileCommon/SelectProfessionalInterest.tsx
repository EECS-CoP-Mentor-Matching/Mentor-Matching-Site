import { TextField, Autocomplete } from "@mui/material";
import DropDownControl from "../common/forms/dropDowns/DropDownControl";

function SelectProfessionalInterest() {
  const professionalInterests = [
    { label: 'Resume', id: 1 },
    { label: 'Interviews', id: 1 },
    { label: 'Job Applications', id: 1 },
  ]

  return (
    <DropDownControl label="Interests" options={professionalInterests} onSelect={() => { }} />
  );
}

export default SelectProfessionalInterest;
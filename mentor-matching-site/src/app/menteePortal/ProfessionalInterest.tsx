import { TextField, Autocomplete } from "@mui/material";
import Interest from "./Interest";

function ProfessionalInterest() {
  const professionalInterests = [
    { label: 'Resume', id: 1 },
    { label: 'Interviews', id: 1 },
    { label: 'Job Applications', id: 1 },
  ]

  return (
    <Interest options={professionalInterests} />
  );
}

export default ProfessionalInterest;
import { TextField, Autocomplete } from "@mui/material";
import { useState } from "react";
import "./ExperienceLevel.css";

interface ExperienceLevelProps {
  label: string
}

function ExperienceLevel(props: ExperienceLevelProps) {
  const [level, setLevel] = useState('1')
  const experienceLevels = [
    { label: 'Novice (0 - 1 years)', id: 1 },
    { label: 'Intermediate (1 - 3 years)', id: 2 },
    { label: 'Advanced (3 - 5 years)', id: 3 },
    { label: 'Expert (5+ years)', id: 4 }
  ]

  return (
    <div>
      <Autocomplete 
        options={experienceLevels}
        disableCloseOnSelect
        sx={{ width: 225 }}
        renderInput={(params) => <TextField {...params} label="Experience Level" />}
      />
    </div>
  );
}

export default ExperienceLevel;
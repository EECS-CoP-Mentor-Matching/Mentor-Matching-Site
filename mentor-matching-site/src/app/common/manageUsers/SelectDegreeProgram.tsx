import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import selectionItemsDb from "../../../dal/selectionItemsDb";
import { DocItem } from "../../../types/types";
import { DegreeProgram } from "../../../types/userProfile";

interface SelectDegreeProgramProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function SelectDegreeProgram({
  value,
  onChange,
  disabled = false
}: SelectDegreeProgramProps) {
  const [degreePrograms, setDegreePrograms] = useState<{ id: string; label: string }[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      const items: DocItem<DegreeProgram>[] = await selectionItemsDb.degreeProgramsAsync();
      const mapped = items.map((item) => ({
        id: item.docId,
        label: item.data.degreeProgramName
      }));
      setDegreePrograms(mapped);
      setLoaded(true);
    };
    load();
  }, []);

  // If the user already has a value saved and it's not in the dropdown options,
  // show it as a read-only text field so it's never lost
  const valueIsInOptions = degreePrograms.some((p) => p.label === value);
  const hasExistingValue = value && value.trim() !== "";

  if (loaded && hasExistingValue && !valueIsInOptions) {
    return (
      <TextField
        fullWidth
        label="Degree Program"
        value={value}
        disabled={disabled}
        variant="standard"
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }

  return (
    <FormControl fullWidth>
      <InputLabel>Degree Program</InputLabel>
      <Select
        value={loaded ? value : ""}
        label="Degree Program"
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as string)}
      >
        {degreePrograms.map((program) => (
          <MenuItem key={program.id} value={program.label}>
            {program.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

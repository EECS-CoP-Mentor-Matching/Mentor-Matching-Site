import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import selectionItemsDb from "../../../../../dal/selectionItemsDb";
import { DocItem } from "../../../../../types/types";
import { DegreeProgram } from "../../../../../types/userProfile";

interface AdminSelectDegreeProgramProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdminSelectDegreeProgram({
  value,
  onChange
}: AdminSelectDegreeProgramProps) {
  const [degreePrograms, setDegreePrograms] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const items: DocItem<DegreeProgram>[] =
        await selectionItemsDb.degreeProgramsAsync();
      const mapped = items.map((item) => ({
        id: item.docId,
        label: item.data.degreeProgramName
      }));
      setDegreePrograms(mapped);
    };

    load();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Degree Program</InputLabel>
      <Select
        value={value}
        label="Degree Program"
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
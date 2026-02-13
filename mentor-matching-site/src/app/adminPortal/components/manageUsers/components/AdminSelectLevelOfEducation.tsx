import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import selectionItemsDb from "../../../../../dal/selectionItemsDb";
import { DocItem } from "../../../../../types/types";
import { EducationLevel } from "../../../../../types/matchProfile";

interface AdminSelectEducationLevelProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdminSelectEducationLevel({
  value,
  onChange
}: AdminSelectEducationLevelProps) {
  const [educationLevels, setEducationLabels] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const items: DocItem<EducationLevel>[] =
        await selectionItemsDb.educationLevelsAsync();
      const mapped = items.map((item) => ({
        id: item.docId,
        label: item.data.level
      }));
      setEducationLabels(mapped);
    };

    load();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Education Level</InputLabel>
      <Select
        value={value}
        label="Education Label"
        onChange={(e) => onChange(e.target.value as string)}
      >
        {educationLevels.map((level) => (
          <MenuItem key={level.id} value={level.label}>
            {level.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
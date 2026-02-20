import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import selectionItemsDb from "../../../dal/selectionItemsDb";
import { TimeZone } from "../../../types/userProfile";
import { DocItem } from "../../../types/types";

interface SelectTimeZoneProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SelectTimeZone({ value, onChange }: SelectTimeZoneProps) {
  const [timeZones, setTimeZones] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const items: DocItem<TimeZone>[] = await selectionItemsDb.timeZonesAsync();
      const mapped = items.map((item) => ({
        id: item.docId,
        label: item.data.timeZoneName
      }));
      setTimeZones(mapped);
    };

    load();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Time Zone</InputLabel>
      <Select
        value={value}
        label="Time Zone"
        onChange={(e) => onChange(e.target.value as string)}
      >
        {timeZones.map((zone) => (
          <MenuItem key={zone.id} value={zone.label}>
            {zone.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
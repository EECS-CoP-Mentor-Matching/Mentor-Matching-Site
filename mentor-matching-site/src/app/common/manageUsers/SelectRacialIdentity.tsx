import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import selectionItemsDb from "../../../dal/selectionItemsDb";
import { DocItem } from "../../../types/types";
import { RacialIdentity } from "../../../types/userProfile";

interface SelectRacialIdentityProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SelectRacialIdentity({
  value,
  onChange
}: SelectRacialIdentityProps) {
  const [identities, setIdentities] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    const load = async () => {
      const items: DocItem<RacialIdentity>[] =
        await selectionItemsDb.racialIdentitiesAsync();
      const mapped = items.map((item) => ({
        id: item.docId,
        label: item.data.identityName
      }));
      setIdentities(mapped);
    };

    load();
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>Racial Identity</InputLabel>
      <Select
        value={value}
        label="Racial Identity"
        onChange={(e) => onChange(e.target.value as string)}
      >
        {identities.map((identity) => (
          <MenuItem key={identity.id} value={identity.label}>
            {identity.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
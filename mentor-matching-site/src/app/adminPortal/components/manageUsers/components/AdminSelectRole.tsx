import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {MatchRole} from "../../../../../types/matchProfile";

interface AdminSelectRoleProps {
  value: string;
  onChange: (value: string) => void;
}

export default function AdminSelectRole({ value, onChange }: AdminSelectRoleProps) {
  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
     const mappedRoles = Object.values(MatchRole).map((roleValue) => ({ id: roleValue, label: roleValue }));
     setRoles(mappedRoles); 
    }, []);

  return (
    <FormControl fullWidth>
      <InputLabel>User Role</InputLabel>
      <Select
        value={value}
        label="User Role"
        onChange={(e) => onChange(e.target.value as string)}
      >
        {roles.map((role) => (
          <MenuItem key={role.id} value={role.label}>
            {role.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
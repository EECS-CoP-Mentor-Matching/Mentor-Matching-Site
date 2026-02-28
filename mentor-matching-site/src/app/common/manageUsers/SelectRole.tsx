import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { MatchRole } from "../../../types/matchProfile";

interface SelectRoleProps {
  value: string;
  onChange: (value: string) => void;
  allowAdmin?: boolean; // If true, shows Admin option
}

export default function SelectRole({ value, onChange, allowAdmin = false }: SelectRoleProps) {
  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);

  useEffect(() => {
    // Build role list based on allowAdmin prop
    const roleValues = allowAdmin 
      ? [MatchRole.mentee, MatchRole.mentor, MatchRole.both, "Admin"] // Include Admin
      : [MatchRole.mentee, MatchRole.mentor, MatchRole.both]; // Exclude Admin
    
    const mappedRoles = roleValues.map((roleValue) => ({ 
      id: String(roleValue), 
      label: String(roleValue) 
    }));
    setRoles(mappedRoles);
  }, [allowAdmin]);

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

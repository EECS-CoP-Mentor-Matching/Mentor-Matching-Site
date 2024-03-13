import { Checkbox, FormControl, FormLabel, InputLabel } from "@mui/material";

interface CheckBoxControlProps {
  onChange: (isChecked: boolean) => void
  label: string
  checked?: boolean
  readOnly?: boolean
}

function CheckBoxControl({ onChange, label, checked, readOnly = false }: CheckBoxControlProps) {
  return (
    <FormControl>
      <FormLabel>{label}</FormLabel>
      <Checkbox 
        onChange={(e, checked) => onChange(checked)}
        checked={checked}
        readOnly={readOnly} />
    </FormControl>
  );
}

export default CheckBoxControl;
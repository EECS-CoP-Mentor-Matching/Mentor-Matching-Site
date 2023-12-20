import { Checkbox, FormControl, FormLabel, InputLabel } from "@mui/material";

interface CheckboxControlProps {
  onChange: (isChecked: boolean) => void
  label: string
  checked?: boolean
}

function CheckboxControl(props: CheckboxControlProps) {
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Checkbox onChange={(e, checked) => props.onChange(checked)}
        checked={props.checked} />
    </FormControl>
  );
}

export default CheckboxControl;
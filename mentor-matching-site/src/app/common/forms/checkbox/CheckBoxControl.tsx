import { Checkbox, FormControl, FormLabel, InputLabel } from "@mui/material";

interface CheckBoxControlProps {
  onChange: (isChecked: boolean) => void
  label: string
  checked?: boolean
}

function CheckBoxControl(props: CheckBoxControlProps) {
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <Checkbox onChange={(e, checked) => props.onChange(checked)}
        checked={props.checked} />
    </FormControl>
  );
}

export default CheckBoxControl;
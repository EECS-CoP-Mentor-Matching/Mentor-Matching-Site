import { TextField, Autocomplete, FormControl } from "@mui/material";

interface option {
  label: string
  id: number
}

interface DropDownControlProps {
  options: option[]
  inputLabel: string
  onSelect: (value: string | undefined) => void
}

function DropDownControl(props: DropDownControlProps) {
  return (
    <FormControl>
      <Autocomplete 
        options={props.options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        sx={{ width: 225 }}
        onChange={(e, option) => {
          props.onSelect(option?.label);
        }}
        renderInput={(params) => 
          <TextField {...params} label={props.inputLabel} />}
      />
    </FormControl>
  );
}

export default DropDownControl;
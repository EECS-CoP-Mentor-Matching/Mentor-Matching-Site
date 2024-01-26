import { TextField, Autocomplete, FormControl } from "@mui/material";
import { DropDownOption } from "../../../../types/types";

interface DropDownControlProps {
  options: DropDownOption[]
  label: string
  onSelect: (value: any) => void
  selectedOption?: any
}

function DropDownControl({ options, label, onSelect, selectedOption }: DropDownControlProps) {
  return (
    <FormControl>
      <Autocomplete
        options={options}
        // isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedOption}
        sx={{ width: 225 }}
        onChange={(e, option) => {
          onSelect(option?.label);
        }}
        renderInput={(params) =>
          <TextField {...params} label={label} />}
      />
    </FormControl>
  );
}

export default DropDownControl;
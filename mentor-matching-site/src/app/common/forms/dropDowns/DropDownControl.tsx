import { TextField, Autocomplete, FormControl } from "@mui/material";
import { DropDownOption } from "../../../../types/types";

interface DropDownControlProps {
  options: DropDownOption[]
  label?: string
  onSelect: (value: any) => void
  valueIs: ('id' | 'label')
  selectedOption?: any
  widthMulti?: number
}

function DropDownControl({ options, label, onSelect, valueIs: returnValue, selectedOption, widthMulti }: DropDownControlProps) {
  const controlStyle = {
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`
  }

  const checkOptionExists = () => {
    options.forEach(option => {
      if (selectedOption == option.label) return true;
    });
    return false;
  }

  const onChange = (e: any, option: any) => {
    if (returnValue === 'id') {
      onSelect(option?.id);
    }
    else {
      onSelect(option?.label);
    }
  }

  return (
    <FormControl>
      <Autocomplete
        options={options}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedOption}
        sx={controlStyle}
        onChange={onChange}
        renderInput={(params) =>
          <TextField {...params} label={label} />}
      />
    </FormControl>
  );
}

export default DropDownControl;
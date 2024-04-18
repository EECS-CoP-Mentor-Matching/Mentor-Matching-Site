import { TextField, Autocomplete, FormControl } from "@mui/material";
import { DropDownOption } from "../../../../types/types";

interface DropDownControlProps {
  options: DropDownOption[]
  label?: string
  onSelect: (id: any, label: any) => void
  valueIs?: ('id' | 'label')
  selectedValue?: any
  widthMulti?: number
  required?: boolean;
}

function DropDownControl({ options, label, onSelect, valueIs = 'id', selectedValue, widthMulti }: DropDownControlProps) {
  const controlStyle = {
    width: `${widthMulti === undefined ? 10 : widthMulti * 100}rem`
  }

  const onChange = (e: any, option: any) => {
    if (valueIs === 'id') {
      onSelect(option?.id, option?.id);
    }
    else {
      onSelect(option?.id, option?.label);
    }
  }

  return (
    <FormControl>
      <Autocomplete
        options={options}
        sx={controlStyle}
        onChange={onChange}
        renderInput={(params) =>
          <TextField {...params} label={label} value={selectedValue} />}
      />
    </FormControl>
  );
}

export default DropDownControl;
import { TextField, Autocomplete } from "@mui/material";

interface option {
  label: string
  id: number
}

interface SelectInterestProps {
  options: option[]
}

function SelectInterest(props: SelectInterestProps) {
  return (
    <div>
      <Autocomplete 
        options={props.options}
        disableCloseOnSelect
        sx={{ width: 225 }}
        renderInput={(params) => <TextField {...params} label="Interest" />}
      />
    </div>
  );
}

export default SelectInterest;
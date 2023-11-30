import { TextField, Autocomplete } from "@mui/material";

interface option {
  label: string
  id: number
}

interface InterestProps {
  options: option[]
}

function Interest(props: InterestProps) {
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

export default Interest;
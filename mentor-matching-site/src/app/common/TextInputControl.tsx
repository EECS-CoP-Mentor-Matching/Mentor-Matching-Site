import { Input, FormControl, InputLabel } from "@mui/material";

interface TextInputControlProps {
  onInput: (data: string) => void
  label: string
  value?: string
}

function TextInputControl(props: TextInputControlProps) {
  return (
    <FormControl className="form-control">
      <InputLabel>{props.label}</InputLabel>
      <Input value={props.value} onChange={(e) => {
        props.onInput(e.target.value);
      }}/>
    </FormControl>
  );
}

export default TextInputControl;
import { Input, FormControl, InputLabel } from "@mui/material";

interface TextInputControlProps {
  onInput?: (data: string) => void
  label: string
  value?: string
  readonly?: boolean
}

function TextInputControl(props: TextInputControlProps) {
  return (
    <FormControl className="form-control">
      <InputLabel>{props.label}</InputLabel>
      <Input value={props.value} 
        readOnly={props.readonly}
        onChange={(e) => {
          if (props.onInput !== undefined) {
            props.onInput(e.target.value);
          }
      }}/>
    </FormControl>
  );
}

export default TextInputControl;
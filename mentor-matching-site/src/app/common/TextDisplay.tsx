import { FormControl, TextField } from "@mui/material";
import "./Display.css";

interface TextDisplayProps {
  label: string
  value?: string
}

function TextDisplay(props: TextDisplayProps) {
  return (
    <FormControl className="form-display">
      <div>{props.label}</div>
      <TextField value={props.value} />
    </FormControl>
  );
}

export default TextDisplay;
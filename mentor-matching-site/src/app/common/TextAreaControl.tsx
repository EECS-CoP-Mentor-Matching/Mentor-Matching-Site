import { FormControl, FormLabel, InputLabel, TextareaAutosize } from "@mui/material";

interface TextAreaControlProps {
  onInput: (data: string) => void
  label: string
}

function TextAreaControl(props: TextAreaControlProps) {
  return (
    <FormControl>
      <FormLabel>{props.label}</FormLabel>
      <TextareaAutosize onChange={(e) => {
        props.onInput(e.target.value);
      }} />
    </FormControl>
  );
}

export default TextAreaControl;
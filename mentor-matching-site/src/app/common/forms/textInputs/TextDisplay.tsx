import { FormControl, TextField } from "@mui/material";

interface TextDisplayProps {
  label: string
  value?: string
  widthMulti: number
}

function TextDisplay({ label, value, widthMulti }: TextDisplayProps) {
  const controlStyle = {
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`,
  }

  return (
    <FormControl>
      <div>{label}</div>
      <div>{value}</div>
    </FormControl>
  );
}

export default TextDisplay;
import { FormControl } from "@mui/material";
import { ReactElement } from "react";

interface TextDisplayProps {
  children?: ReactElement[] | ReactElement | any
  label?: string
  widthMulti?: number
}

function TextDisplay({ children, label, widthMulti }: TextDisplayProps) {
  const controlStyle = {
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`
  }

  return (
    <FormControl style={{ whiteSpace: 'pre-line', textAlign: 'start', ...controlStyle }}>
      {label}
      {children}
    </FormControl>
  );
}

export default TextDisplay;
import { FormControl, FormLabel } from "@mui/material";
import { ReactElement } from "react";

interface TextDisplayProps {
  children?: ReactElement[] | ReactElement | any
  label?: string
  textAlignment?: string
  widthMulti?: number
}

function TextDisplay({ children, label, textAlignment, widthMulti }: TextDisplayProps) {
  const controlStyle = {
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`
  }

  return (
    <FormControl style={{
      whiteSpace: 'pre-line',
      textAlign: 'start',
      ...controlStyle
    }}>
      {label !== undefined &&
        <FormLabel>{label}</FormLabel>
      }
      {children}
    </FormControl>
  );
}

export default TextDisplay;
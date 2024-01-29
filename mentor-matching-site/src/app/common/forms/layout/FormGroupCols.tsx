import { FormGroup } from "@mui/material";
import { ReactElement } from "react";

interface FormGroupColsProps {
  children?: ReactElement[] | ReactElement | any
  style?: any
}

function FormGroupCols({ children, style }: FormGroupColsProps) {
  return (
    <FormGroup style={{ flexDirection: 'column', gap: '2rem', ...style }}>
      {children}
    </FormGroup>
  );
}

export default FormGroupCols;
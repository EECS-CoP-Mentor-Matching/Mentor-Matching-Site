import { FormGroup } from "@mui/material";
import { ReactElement } from "react";

interface FormGroupRowsProps {
  children?: ReactElement[] | ReactElement | any
  style?: any
}

function FormGroupRows({ children, style }: FormGroupRowsProps) {
  return (
    <FormGroup style={{ flexDirection: 'row', gap: '2rem', ...style }}>
      {children}
    </FormGroup>
  );
}

export default FormGroupRows;
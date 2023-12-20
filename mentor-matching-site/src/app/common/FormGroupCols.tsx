import { FormGroup } from "@mui/material";
import { ReactElement } from "react";

interface FormGroupColsProps {
  children: ReactElement[] | ReactElement | any
}

function FormGroupCols(props: FormGroupColsProps) {
  return (
    <FormGroup style={{ flexDirection: 'column'}}>
      {props.children}
    </FormGroup>
  );
}

export default FormGroupCols;
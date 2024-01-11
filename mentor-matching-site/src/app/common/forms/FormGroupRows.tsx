import { FormGroup } from "@mui/material";
import { ReactElement } from "react";

interface FormGroupRowsProps {
  children: ReactElement[] | ReactElement | any
}

function FormGroupRows(props: FormGroupRowsProps) {
  return (
    <FormGroup style={{ flexDirection: 'row'}}>
      {props.children}
    </FormGroup>
  );
}

export default FormGroupRows;
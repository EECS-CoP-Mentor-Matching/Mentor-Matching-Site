import FormGroupRows from "../../../common/FormGroupRows";
import { Button } from "@mui/material";
import TextInputControl from "../../../common/TextInputControl";
import { useState } from "react";
import FormGroupCols from "../../../common/FormGroupCols";

interface NewUserSubmitProps {
  createNewUser: (password: string) => void
}

function NewUserSubmit(props: NewUserSubmitProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  return (
    <FormGroupCols>
      <TextInputControl label="Password" onInput={setPassword}/>
      <TextInputControl label="Confirm Password" onInput={setConfirmPassword} />
      <Button onClick={() => {props.createNewUser(password);}}>Create Account</Button>
    </FormGroupCols>
  );
}

export default NewUserSubmit;
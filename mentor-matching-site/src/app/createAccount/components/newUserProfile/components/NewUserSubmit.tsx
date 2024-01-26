import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import { Button } from "@mui/material";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import { useState } from "react";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";

interface NewUserSubmitProps {
  createNewUser: (password: string) => void
}

function NewUserSubmit(props: NewUserSubmitProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <FormGroupCols>
      <TextInputControl label="Password" onInput={setPassword} sensitive={true} />
      <TextInputControl label="Confirm Password" onInput={setConfirmPassword} sensitive={true} />
      <Button onClick={() => { props.createNewUser(password); }}>Create Account</Button>
    </FormGroupCols>
  );
}

export default NewUserSubmit;
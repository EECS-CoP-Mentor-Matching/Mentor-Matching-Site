import { Button } from "@mui/material";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import { useState } from "react";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import ErrorMessage, { ErrorState } from "../../../../common/forms/ErrorMessage";

interface NewUserSubmitProps {
  createNewUser: (password: string) => void
}

function NewUserSubmit(props: NewUserSubmitProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMessage: ''
  } as ErrorState)

  const verifyPasswordsMatch = () => {
    if (password !== confirmPassword) {
      setErrorState({
        isError: true,
        errorMessage: 'Passwords did not match'
      })
    }
    else {
      props.createNewUser(password);
    }
  }

  return (
    <FormGroupCols>
      <TextInputControl label="Password" onInput={setPassword} sensitive={true} />
      <TextInputControl label="Confirm Password" onInput={setConfirmPassword} sensitive={true} />
      <Button onClick={verifyPasswordsMatch}>Create Account</Button>
      <ErrorMessage errorState={errorState} />
    </FormGroupCols>
  );
}

export default NewUserSubmit;
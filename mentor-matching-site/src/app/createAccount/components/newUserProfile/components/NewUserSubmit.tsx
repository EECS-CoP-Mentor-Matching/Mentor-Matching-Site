import { Button } from "@mui/material";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";
import { useState } from "react";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import ErrorMessage, { ErrorState } from "../../../../common/forms/ErrorMessage";

function NewUserSubmit() {
  const [errorState, setErrorState] = useState({
    isError: false,
    errorMessage: ''
  } as ErrorState)

  return (
    <FormGroupCols>
      <ErrorMessage errorState={errorState} />
    </FormGroupCols>
  );
}

export default NewUserSubmit;
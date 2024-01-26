import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";
import TextInputControl from "../../common/forms/textInputs/TextInputControl";

interface EmailProps {
  setEmail: (email: string) => void
  submitEmail: () => void
  emailValidation: (email: string) => boolean
}

function Email({ setEmail, submitEmail, emailValidation }: EmailProps) {
  return (
    <>
      <TextInputControl onInput={setEmail} label="Email"
        onSubmit={submitEmail}
        onSubmitValidation={emailValidation}
        widthMulti={.25} />
    </>
  );
}

export default Email;
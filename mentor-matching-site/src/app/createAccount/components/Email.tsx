import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";
import TextInputControl from "../../common/forms/TextInputControl";

interface EmailProps {
  setEmail: (email: string) => void
  submitEmail: () => void
  emailValidation: (email: string) => boolean
}

function Email(props: EmailProps) {
  return (
    <>
      <TextInputControl onInput={props.setEmail} label="Email"
        onSubmit={props.submitEmail}
        onSubmitValidation={props.emailValidation} />
    </>
  );
}

export default Email;
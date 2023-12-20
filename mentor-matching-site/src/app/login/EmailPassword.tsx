import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";
import "./Login.css";
import SensitiveTextInputControl from "../common/SensitiveTextInputControl";
import TextInputControl from "../common/TextInputControl";

interface EmailPasswordProps {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

function EmailPassword(props: EmailPasswordProps) {
  return (
    <FormGroup className="form-group">
      <TextInputControl onInput={props.setEmail} label="Email" />
      <SensitiveTextInputControl onInput={props.setPassword} label="Password" />
    </FormGroup>
  )
}

export default EmailPassword;
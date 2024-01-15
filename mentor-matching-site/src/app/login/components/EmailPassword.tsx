import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";
import "../Login.css";
import SensitiveTextInputControl from "../../common/forms/SensitiveTextInputControl";
import TextInputControl from "../../common/forms/TextInputControl";

interface EmailPasswordProps {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

function EmailPassword(props: EmailPasswordProps) {
  return (
    <FormGroup className="form-group">
      <TextInputControl onInput={props.setEmail} label="Email" widthMulti={.25} />
      <TextInputControl onInput={props.setPassword} label="Password" widthMulti={.25} sensitive={true} />
    </FormGroup>
  )
}

export default EmailPassword;
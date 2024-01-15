import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";
import "../Login.css";
import SensitiveTextInputControl from "../../common/forms/SensitiveTextInputControl";
import TextInputControl from "../../common/forms/TextInputControl";

interface EmailPasswordProps {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  onSubmit: () => void
}

function EmailPassword({ setEmail, setPassword, onSubmit }: EmailPasswordProps) {
  return (
    <FormGroup className="form-group">
      <TextInputControl onInput={setEmail} label="Email" widthMulti={.25} onSubmit={onSubmit} />
      <TextInputControl onInput={setPassword} label="Password" widthMulti={.25} sensitive={true} onSubmit={onSubmit} />
    </FormGroup>
  )
}

export default EmailPassword;
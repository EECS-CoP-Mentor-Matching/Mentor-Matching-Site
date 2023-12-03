import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";
import "./Login.css";

interface EmailPasswordProps {
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

function EmailPassword(props: EmailPasswordProps) {
  return (
    <FormGroup className="form-group">
      <FormControl className="form-control">
        <InputLabel>Email</InputLabel>
        <Input onChange={(e) => {
          props.setEmail(e.target.value);
        }}/>
      </FormControl>
      <FormControl className="form-control">
        <InputLabel>Password</InputLabel>
        <Input onChange={(e) => {
          props.setPassword(e.target.value);
        }}/>
      </FormControl>
    </FormGroup>
  )
}

export default EmailPassword;
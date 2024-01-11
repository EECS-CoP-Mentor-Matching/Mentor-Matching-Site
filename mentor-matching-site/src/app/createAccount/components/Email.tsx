import { InputLabel, Input, FormControl, FormGroup } from "@mui/material";

interface EmailProps {
  setEmail: (email: string) => void
}

function Email(props: EmailProps) {
  return (
    <FormGroup className="form-group">
      <FormControl className="form-control">
        <InputLabel>Email</InputLabel>
        <Input onChange={(e) => {
          props.setEmail(e.target.value);
        }}/>
      </FormControl>
    </FormGroup>
  );
}

export default Email;
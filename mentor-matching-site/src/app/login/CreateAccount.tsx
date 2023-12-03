import EmailPassword from "./EmailPassword";
import { useState } from "react";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { UserProfile } from "../../types";
import { FormControl, Button, FormLabel, FormGroup } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface CreateAccountProps {
  setSignedIn: (signedIn: boolean) => void;
}

function CreateAccount(props: CreateAccountProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function createNewUser() {
    const user = await authService.createUser(email, password);
    // const userProfile = new UserProfile()
    // add user to the database with their UID as the key
    // userService.createNewUser()
    if (user !== undefined) {
      props.setSignedIn(true);
      navigate("/");
    }
  }

  return (
    <div className='login'>
      <FormGroup className="form-group">
        <FormLabel>Welcome, start by entering your email</FormLabel>
        <EmailPassword setEmail={setEmail} setPassword={setPassword} />
        <FormControl className="form-control">
          <Button onClick={createNewUser}>Create an Account</Button>
        </FormControl>
      </FormGroup>
    </div>
  )
}

export default CreateAccount;
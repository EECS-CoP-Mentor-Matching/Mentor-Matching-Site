import EmailPassword from "./EmailPassword";
import { useState } from "react";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { UserProfile } from "../../types";
import { FormControl, Button, FormLabel, FormGroup } from "@mui/material";

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function createNewUser() {
    authService.createUser(email, password);
    // const userProfile = new UserProfile()
    // add user to the database with their UID as the key
    // userService.createNewUser()
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
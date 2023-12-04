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
    try {
      const user = await authService.createUser(email, password);
      if (user) {
        // Create a new user profile
        const newUserProfile: UserProfile = {
          UID: user.uid,
          // Set other initial values for the user profile
        };
        await userService.createNewUser(newUserProfile);
        // Set signed-in state and navigate
        props.setSignedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.error('Failed to create a new user:', error);
      // Handle error (show message to user, etc.)
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
import EmailPassword from "./EmailPassword";
import { useState } from "react";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { UserProfile } from "../../types";

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
    <div className='login-form'>
      <div>Hello, please login</div>
      <EmailPassword setEmail={setEmail} setPassword={setPassword} />
      <div className='login-form-controls'>
        <button onClick={createNewUser}>Create an Account</button>
      </div>
    </div>
  </div>
  )
}

export default CreateAccount;
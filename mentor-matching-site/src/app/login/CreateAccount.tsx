import EmailPassword from "./EmailPassword";
import { useState } from "react";
import { authService } from "../../service/authService";

function CreateAccount() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function createNewUser() {
    authService.createUser(email, password);
  }

  return (
    <div className='login'>
    <div className='login-form'>
      <div>Hello, please login</div>
      <EmailPassword setEmail={setEmail} setPassword={setPassword} />
      <div className='login-form-controls'>
        <a onClick={createNewUser}>Create an Account</a>
      </div>
    </div>
  </div>
  )
}

export default CreateAccount;
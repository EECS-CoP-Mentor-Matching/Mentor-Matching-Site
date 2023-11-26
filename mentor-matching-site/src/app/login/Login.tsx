import { useState } from "react";
import "./Login.css";
import EmailPassword from './EmailPassword';
import { authService } from "../../service/authService";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  function login() {
    authService.signIn(email, password);
  }

  return (
    <div className='login'>
      <div className='login-form'>
        <div>Hello, please login</div>
        <EmailPassword setEmail={setEmail} setPassword={setPassword} />
        <div className='login-form-controls'>
          <button onClick={login}>Login</button>
          <a href="/create-account">Create an Account</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
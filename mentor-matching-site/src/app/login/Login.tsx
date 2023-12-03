import { useState } from "react";
// import "./Login.css";
import EmailPassword from "./EmailPassword";
import authService from "../../service/authService";
import { Button, FormControl, FormGroup, FormLabel, Link } from "@mui/material";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function login() {
    authService.signIn(email, password);
  }

  return (
    <div className="login">
      <FormGroup className="form-group">
        <FormLabel>Hello, please login</FormLabel>
        <EmailPassword setEmail={setEmail} setPassword={setPassword} />
        <FormControl className="form-control">
          <Button onClick={login}>Login</Button>
          <Button href="/create-account">Create an Account</Button>
        </FormControl>
      </FormGroup>
    </div>
  );
}

export default Login;
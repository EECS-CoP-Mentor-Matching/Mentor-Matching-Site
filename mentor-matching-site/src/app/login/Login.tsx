import { useState } from "react";
import EmailPassword from "./components/EmailPassword";
import authService from "../../service/authService";
import { Button, FormControl, FormGroup, FormLabel, Link } from "@mui/material";
import "./Login.css";
import { User } from "firebase/auth";
import { refreshNavigate } from "../common/auth/refreshNavigate";
import ErrorMessage, { ErrorState, resetError } from "../common/forms/ErrorMessage";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorState, setErrorState] = useState<ErrorState>(resetError())

  async function login() {
    setErrorState(resetError())
    try {
      const user = (await authService.signIn(email, password)) as User;
      if (user !== undefined) {
        refreshNavigate("/");
      }
    }
    catch (error) {
      setErrorState({ errorMessage: "Username or password was inavlid", isError: true })
    }
  }

  return (
    <>
      <div className="login">
        <FormGroup className="form-group">
          <FormLabel>Hello, please login</FormLabel>
          <EmailPassword setEmail={setEmail} setPassword={setPassword} onSubmit={login} />
          <FormControl className="form-control">
            <Button onClick={login}>Login</Button>
            <Button href="/create-account">Create an Account</Button>
          </FormControl>
          <ErrorMessage errorState={errorState} />
        </FormGroup>
      </div>
    </>
  );
}

export default Login;
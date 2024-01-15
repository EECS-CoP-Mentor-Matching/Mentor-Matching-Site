import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./Login.css";
import EmailPassword from "./components/EmailPassword";
import authService from "../../service/authService";
import { Button, FormControl, FormGroup, FormLabel, Link } from "@mui/material";
import "./Login.css";
import { User } from "firebase/auth";

interface LoginProps {
  setSignedIn: (signedIn: boolean) => void;
}

function Login(props: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function login() {
    try {
      const user = (await authService.signIn(email, password)) as User;
      if (user !== undefined) {
        props.setSignedIn(true);
        navigate("/");
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="login">
      <FormGroup className="form-group">
        <FormLabel>Hello, please login</FormLabel>
        <EmailPassword setEmail={setEmail} setPassword={setPassword} onSubmit={login} />
        <FormControl className="form-control">
          <Button onClick={login}>Login</Button>
          <Button href="/create-account">Create an Account</Button>
        </FormControl>
      </FormGroup>
    </div>
  );
}

export default Login;
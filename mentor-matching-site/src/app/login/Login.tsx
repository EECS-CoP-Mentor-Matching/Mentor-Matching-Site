import { useState } from "react";
import EmailPassword from "./components/EmailPassword";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { Button, FormControl, FormGroup, FormLabel } from "@mui/material";
import "./Login.css";
import { User } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ErrorMessage, { ErrorState, resetError } from "../common/forms/ErrorMessage";
import { AdminMatchRole } from "../../types/matchProfile";
import { UserProfile } from "../../types/userProfile";

// REDUX IMPORTS: Needed to update the app state immediately
import { useAppDispatch } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/userProfileReducer";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorState, setErrorState] = useState<ErrorState>(resetError());
  
  const navigate = useNavigate();
  const dispatch = useAppDispatch(); // Initialize Redux dispatch

  async function login() {
    setErrorState(resetError());
    try {
      const user = (await authService.signInSession(email, password)) as User;
      
      if (user) {
        // 1. Fetch the user profile immediately after login
        const userProfile: UserProfile = await userService.getUserProfile(user.uid);
        
        // 2. DISPATCH TO REDUX: This is what "refreshes" the SideNav links
        dispatch(updateProfile(userProfile));

        const role = userProfile.preferences?.role;

        // 3. Direct Redirect based on Database Role
        if (role === AdminMatchRole.admin) {
          navigate("/admin-portal");
        } else if (role === AdminMatchRole.mentee) {
          navigate("/mentee-portal");
        } else if (role === AdminMatchRole.mentor) {
          navigate("/mentor-portal");
        } else if (role === AdminMatchRole.both) {
          // Handling the 'both' case specifically if it exists in your logic
          navigate("/mentee-portal"); 
        } else {
          // Fallback if they have an account but haven't finished setup
          navigate("/new-profile");
        }
      }
    }
    catch (error) {
      console.error("Login failed", error);
      setErrorState({ errorMessage: "Username or password was invalid", isError: true });
    }
  }

  return (
    <div className="login">
      <FormGroup className="form-group">
        <FormLabel>Log In</FormLabel>
        <EmailPassword setEmail={setEmail} setPassword={setPassword} onSubmit={login} />
        <FormControl className="form-control">
          <Button onClick={login} variant="contained">Login</Button>
          <Button onClick={() => navigate("/create-account")}>Create an Account</Button>
        </FormControl>
        <ErrorMessage errorState={errorState} />
      </FormGroup>
    </div>
  );
}

export default Login;
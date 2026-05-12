import Email from "./components/Email";
import {useEffect, useState} from "react";
import {FormControl, FormLabel, FormGroup, Button} from "@mui/material";
import SubmitButton from "../common/forms/buttons/SubmitButton";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { updateEmail } from "../../redux/reducers/userProfileReducer";
import ErrorMessage, { ErrorState } from "../common/forms/ErrorMessage";
import FormHeader from "../common/forms/layout/FormHeader";
import authService from "../../service/authService";
import Password from "./components/Password";
import LoadingMessage from "../common/forms/modals/LoadingMessage";
import {refreshNavigate} from "../common/auth/refreshNavigate";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./CreateAccount.css";

function CreateAccount() {
  const [error, setError] = useState<ErrorState>({
    isError: false,
    errorMessage: ""
  })

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const selector = useAppSelector;
  const email = selector(state => state.userProfile.userProfile?.contact?.email ?? '');

  const [createAccountLoading, setCreateAccountLoading] = useState(false);

  const setEmail = async () => {
    updateEmail(email)
  }

  async function createNewUser() : Promise<any | null> {
    setCreateAccountLoading(true);

    try {
      const user = await authService.createUser(email, password);
      if (user) {
        setCreateAccountLoading(false);
        return user; // Returns the user object if successful
      }
    } catch (error: any) {  // Use 'any' to handle different error types
      if (error.code === 'auth/email-already-in-use') {
        // Email is already in use
        setError({
          isError: true,
          errorMessage: `Email is already in use`,
        } as ErrorState);
      } else {
        // Handle other potential errors
        console.error('Failed to create a new user:', error);
      }
    }

    setCreateAccountLoading(false);
    return null;
  }

  const signup = async () => {
    setError({ isError: false, errorMessage: "" } as ErrorState)

    if (password !== confirmPassword) {
      setError({ isError: true, errorMessage: "Passwords do not match" } as ErrorState)
      return;
    }

    if (!validateValue(email)) {
      setError({ isError: true, errorMessage: "Email is invalid" } as ErrorState)
      return;
    }

    const newUser = await createNewUser()

    // Just to be safe, check for a null user, which means that the create user process failed.  Return and stop processing here:
    if (!newUser) return;

    // Extract the user ID and email address if provided:
    const uid = newUser.uid;
    const userEmail = newUser.email ?? "";

    // Handle non-OSU email addresses-- they will need to be approved before they can make a profile.
    if (!userEmail.toLowerCase().endsWith("@oregonstate.edu"))
    {
      // Add the user to the pendingUsers database for now:
      await setDoc(doc(db, "pendingUsers", uid), {
        email: userEmail,
        createdAt: serverTimestamp()
      });

      // Redirect to verify-email with a flag so the page shows pending approval messaging
      navigate("/verify-email?pending=true");
      return;
    }

    // Here the user has an OSU email address.  Move them to the new profile screen:
    refreshNavigate('/new-profile');
  }

  const validateValue = (currEmailValue: string): boolean => {
    // OSU email address only:
    //const regex = new RegExp("^[a-zA-Z0-9._-]+@oregonstate\\.edu$");

    // General email address:
    const regex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\\.[a-zA-Z0-9._-]+");
    return regex.test(currEmailValue);
  }


  useEffect(() => {
    const checkUser = async () => {
      const user = await authService.getSignedInUser();
      if (user) {
        // Redirect if the user is already signed in
        navigate("/");
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <div className='create-account-page'>
      <div className="create-account-container">
        {/* Logo and Welcome - ABOVE the card */}
        <div className="intro-heading">

          <div className="welcome-text">
            <h2>Welcome</h2>
            <h3>Create Your Account</h3>
          </div>
        </div>

        {/* Create Account Form Card */}
        <FormGroup className="form-group">
          <FormHeader>Start by entering your email</FormHeader>
          <FormLabel className="form-label">Please use your Oregon State email if you have it.</FormLabel>
          <Email submitEmail={setEmail} />
          <Password label="Password" onInput={setPassword} />
          <Password label="Confirm Password" onInput={setConfirmPassword} />
          <FormControl className="form-control">
            <SubmitButton onClick={signup} text="Create an Account" widthMulti={.15} />
          </FormControl>
          <ErrorMessage errorState={error} />
        </FormGroup>
      </div>
      <LoadingMessage message="Creating your account.... Don't refresh!" loading={createAccountLoading} />
    </div>
  )
}

export default CreateAccount;

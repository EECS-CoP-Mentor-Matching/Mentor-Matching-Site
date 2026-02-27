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

function CreateAccount() {
  const [error, setError] = useState<ErrorState>({
    isError: false,
    errorMessage: ""
  })

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();
  const selector = useAppSelector;
  const email = selector(state => state.userProfile.userProfile.contact.email);

  const [createAccountLoading, setCreateAccountLoading] = useState(false);

  const setEmail = async () => {
    updateEmail(email)
  }

  async function createNewUser() : Promise<boolean> {
    setCreateAccountLoading(true);

    try {
      const user = await authService.createUser(email, password);
      if (user) {
        setCreateAccountLoading(false);
        return true;
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
    return false;
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

    const userCreated = await createNewUser()

    if (userCreated) {
      refreshNavigate('/new-profile');
    }
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
    <div className='login'>
      <FormGroup className="form-group">
          <FormHeader>Welcome, start by entering your email</FormHeader>
          <FormLabel>Please use your Oregon State email if you have it.</FormLabel>
          <Email submitEmail={setEmail} />
          <Password label="Password" onInput={setPassword} />
          <Password label="Confirm Password" onInput={setConfirmPassword} />
          <FormControl className="form-control">
            <SubmitButton onClick={signup} text="Create an Account" widthMulti={.15} />
          </FormControl>
        <ErrorMessage errorState={error} />
      </FormGroup>
      <LoadingMessage message="Creating your account.... Don't refresh!" loading={createAccountLoading} />
    </div>
  )
}

export default CreateAccount;
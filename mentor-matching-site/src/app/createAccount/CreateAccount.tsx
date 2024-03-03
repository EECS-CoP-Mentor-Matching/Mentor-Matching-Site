import Email from "./components/Email";
import { useState } from "react";
import userService from "../../service/userService";
import { FormControl, FormLabel, FormGroup } from "@mui/material";
import NewUserProfile from "./components/newUserProfile/NewUserProfile";
import SubmitButton from "../common/forms/SubmitButton";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateEmail } from "../../redux/reducers/userProfileReducer";
import ErrorMessage, { ErrorState } from "../common/forms/ErrorMessage";
import FormHeader from "../common/forms/layout/FormHeader";
import FormSectionHeader from "../common/forms/layout/FormSectionHeader";

enum Step {
    CheckEmail,
    UserExists,
    NewUser
}



function CreateAccount() {
    const [currentStep, setCurrentStep] = useState(Step.CheckEmail);
    const [error, setError] = useState<ErrorState>({
        isError: false,
        errorMessage: ""
    })

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const selector = useAppSelector;
    const email = selector(state => state.userProfile.userProfile.contact.email);

    const checkUserExists = async () => {
        if (!validateValue(email)) {
            setError({ isError: true, errorMessage: "Email is invalid" } as ErrorState)
            return;
        }
        else {
            setError({ isError: false, errorMessage: "" } as ErrorState)
        }

        const userExists = await userService.userExists(email);
        dispatch(updateEmail(email));
        if (userExists) {
            setCurrentStep(Step.UserExists);
        }
        else {
            setCurrentStep(Step.NewUser);
        }
    }

    const validateValue = (currEmailValue: string): boolean => {
        const regex = new RegExp("^[\.a-zA-Z0-9\-\_]+@[a-zA-Z0-9\-\_]+\.[a-zA-Z]+$");
        return regex.test(currEmailValue);
    }

    const toLoginPage = () => {
        navigate("/login");
    }

    return (
        <div className='login'>
            <FormGroup className="form-group">
                {currentStep == Step.CheckEmail && <>
                    <FormHeader>Welcome, start by entering your email</FormHeader>
                    <Email submitEmail={checkUserExists} />
                    <FormLabel>Note that if you do not have a valid Oregon State University email, you will not be able to create a mentee profile.</FormLabel>
                    <FormLabel>Please use your Oregon State email if you have it.</FormLabel>
                    <FormControl className="form-control">
                        <SubmitButton onClick={checkUserExists} text="Create an Account" widthMulti={.15} />
                    </FormControl>
                </>}
                {currentStep == Step.NewUser && <>
                    <FormLabel></FormLabel>
                    <NewUserProfile />
                </>}
                {currentStep == Step.UserExists && <>
                    <FormHeader>User already exists with this email</FormHeader>
                    <SubmitButton text="Login?" onClick={toLoginPage} />
                </>}
                <ErrorMessage errorState={error} />
            </FormGroup>
        </div>
    )
}

export default CreateAccount;
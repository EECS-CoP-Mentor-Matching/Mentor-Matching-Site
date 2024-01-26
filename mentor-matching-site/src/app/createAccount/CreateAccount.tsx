import Email from "./components/Email";
import { useState } from "react";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { UserProfile } from "../../types";
import { FormControl, Button, FormLabel, FormGroup } from "@mui/material";
import NewUserProfile from "./components/newUserProfile/NewUserProfile";
import SubmitButton from "../common/forms/SubmitButton";
import { useNavigate } from "react-router-dom";
import SelectLevelOfEducation from "./components/newUserProfile/components/SelectLevelOfEductation";

interface CreateAccountProps {
    setSignedIn: (signedIn: boolean) => void;
}

enum Step {
    CheckEmail,
    UserExists,
    NewUser
}

function CreateAccount({ setSignedIn }: CreateAccountProps) {
    const [email, setEmail] = useState('');
    const [currentStep, setCurrentStep] = useState(Step.CheckEmail);
    const navigate = useNavigate();

    const checkUserExists = async () => {
        const userExists = await userService.userExists(email);
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
                    <FormLabel>Welcome, start by entering your email</FormLabel>
                    <Email setEmail={setEmail}
                        submitEmail={checkUserExists}
                        emailValidation={validateValue} />
                    <FormLabel>Note that if you do not have a valid Oregon State University email, you will not be able to create a mentee profile.</FormLabel>
                    <FormLabel>Please use your Oregon State email if you have it.</FormLabel>
                    <FormControl className="form-control">
                        <SubmitButton onClick={checkUserExists} text="Create an Account" widthMulti={.15} />
                    </FormControl>
                </>}
                {currentStep == Step.NewUser && <>
                    <FormLabel></FormLabel>
                    <NewUserProfile email={email} setSignedIn={setSignedIn} />
                </>}
                {currentStep == Step.UserExists && <>
                    <FormLabel>User already exists with this email</FormLabel>
                    <SubmitButton text="Login?" onClick={toLoginPage} />
                </>}
            </FormGroup>
        </div>
    )
}

export default CreateAccount;
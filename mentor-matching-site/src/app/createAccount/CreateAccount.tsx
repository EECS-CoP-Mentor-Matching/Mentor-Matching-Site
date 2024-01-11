import Email from "./Email";
import { useState } from "react";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { UserProfile } from "../../types";
import { FormControl, Button, FormLabel, FormGroup } from "@mui/material";
import NewUserProfile from "./newUserProfile/NewUserProfile";

interface CreateAccountProps {
    setSignedIn: (signedIn: boolean) => void;
}

enum Step {
    CheckEmail,
    UserExists,
    NewUser
}


function CreateAccount(props: CreateAccountProps) {
    const [email, setEmail] = useState('');
    const [currentStep, setCurrentStep] = useState(Step.CheckEmail);

    async function checkUserExists() {
        const userExists = await userService.userExists(email);
        if (userExists) {
            setCurrentStep(Step.UserExists);
        }
        else {
            setCurrentStep(Step.NewUser);
        }
    }

    return (
        <div className='login'>
            <FormGroup className="form-group">
                {currentStep == Step.CheckEmail && <>
                    <FormLabel>Welcome, start by entering your email</FormLabel>
                    <Email setEmail={setEmail} />
                    <FormLabel>Note that if you do not have a valid Oregon State University email, you will not be able to create a mentee profile.</FormLabel>
                    <FormLabel>Please use your Oregon State email if you have it.</FormLabel>
                    <FormControl className="form-control">
                        <Button onClick={checkUserExists}>Create an Account</Button>
                    </FormControl>
                </>}
                {currentStep == Step.NewUser && <>
                    <FormLabel></FormLabel>
                    <NewUserProfile email={email} setSignedIn={props.setSignedIn} />
                </>}
                {currentStep == Step.UserExists && <>
                    <FormLabel>User already exists with this email</FormLabel>
                    <Button href="/login">Login?</Button>
                </>}
            </FormGroup>
        </div>
    )
}

export default CreateAccount;
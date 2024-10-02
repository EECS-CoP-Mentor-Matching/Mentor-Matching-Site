import {useState} from "react";
import {FormControl, FormGroup, FormLabel} from "@mui/material";
import FormHeader from "../../common/forms/layout/FormHeader";
import SubmitButton from "../../common/forms/buttons/SubmitButton";
import authService from "../../../service/authService";


function VerifyEmail() {

  const [emailSent, setEmailSent] = useState(false);

  const handleResendEmail =  async () => {
    const user = await authService.getSignedInUser()
    if (user) {
      await authService.sendVerifyEmail(user)
    }
    setEmailSent(true);
  };


  return (
    <div className='verifyEmail'>
      <FormGroup className="form-group">
        <FormHeader>To continue, verify your email address</FormHeader>
        <FormLabel>You should have received an email from us containing a link to complete verification.</FormLabel>
        <FormLabel>If the email has not arrived within a few minutes, use the button below to have it resent.</FormLabel>
        <FormControl className="form-control">
          {!emailSent ? (
              <SubmitButton onClick={handleResendEmail} text="Resend email verification" widthMulti={0.2} />
          ) : (
              <FormLabel>Email sent!</FormLabel>
          )}
        </FormControl>
      </FormGroup>
    </div>
  )
}

export default VerifyEmail;
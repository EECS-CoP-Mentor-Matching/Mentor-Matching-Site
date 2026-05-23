import { useState } from "react";
import { FormControl, FormGroup, FormLabel } from "@mui/material";
import FormHeader from "../../common/forms/layout/FormHeader";
import SubmitButton from "../../common/forms/buttons/SubmitButton";
import authService from "../../../service/authService";

function VerifyEmail() {
  const isPending = new URLSearchParams(window.location.search).get("pending") === "true";
  const [emailSent, setEmailSent] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  const handleResendEmail = async () => {
    try {
      const user = await authService.getSignedInUser();
      if (user) {
        await authService.sendVerifyEmail(user);
      }
      setEmailSent(true);
    } catch (error: any) {
      if (error?.code === "auth/too-many-requests") {
        setEmailSent(true); // show success-like state
        // Override with a rate limit message
        setRateLimited(true);
      }
    }
  };

  return (
    <div className="create-account-page">
      <div className="create-account-container">
        <FormGroup className="form-group">
          <FormHeader>To continue, verify your email address</FormHeader>
          <FormLabel>
            You should have received an email from us containing a link to complete verification.
          </FormLabel>
          {isPending ? (
            <>
              <FormLabel style={{ marginTop: "8px" }}>
                Because you registered with a non-OSU email address, your account also requires
                approval from the Mentor Match team. Once approved, you will receive a second
                email with a link to complete your profile setup.
              </FormLabel>
              <FormLabel style={{ marginTop: "8px" }}>
                If your account has already been approved, click below to log in.
              </FormLabel>
            </>
          ) : (
            <FormLabel style={{ marginTop: "8px" }}>
              If the email has not arrived within a few minutes, use the button below to have it resent.
            </FormLabel>
          )}
          {isPending && (
            <FormControl className="form-control">
              <SubmitButton onClick={() => window.location.href = "/login"} text="Log In" widthMulti={0.2} />
            </FormControl>
          )}
          <FormControl className="form-control">
            {!emailSent ? (
              <SubmitButton onClick={handleResendEmail} text="Resend email verification" widthMulti={0.2} />
            ) : (
              <FormLabel>{rateLimited ? "Please wait a moment before requesting another email." : "Email sent!"}</FormLabel>
            )}
          </FormControl>
        </FormGroup>
      </div>
    </div>
  );
}

export default VerifyEmail;

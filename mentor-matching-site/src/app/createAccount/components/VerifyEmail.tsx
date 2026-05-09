import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FormControl, FormGroup, FormLabel } from "@mui/material";
import FormHeader from "../../common/forms/layout/FormHeader";
import SubmitButton from "../../common/forms/buttons/SubmitButton";
import authService from "../../../service/authService";
import { getAuth, applyActionCode } from "firebase/auth";

type PageState = "pending" | "resend" | "verifying" | "verified" | "error";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const oobCode  = searchParams.get("oobCode");
  const isPending = searchParams.get("pending") === "true";

  const [pageState, setPageState] = useState<PageState>(
    oobCode ? "verifying" : isPending ? "pending" : "resend"
  );
  const [emailSent, setEmailSent] = useState(false);

  // If there's an oobCode, apply it immediately on mount
  useEffect(() => {
    if (!oobCode) return;
    const verify = async () => {
      try {
        const auth = getAuth();
        await applyActionCode(auth, oobCode);
        // Reload the user so emailVerified flips to true in the session
        await auth.currentUser?.reload();
        setPageState("verified");
      } catch (e) {
        console.error("Email verification failed:", e);
        setPageState("error");
      }
    };
    verify();
  }, [oobCode]);

  const handleResendEmail = async () => {
    const user = await authService.getSignedInUser();
    if (user) {
      await authService.sendVerifyEmail(user);
    }
    setEmailSent(true);
  };

  return (
    <div className="create-account-page">
      <div className="create-account-container">
        <FormGroup className="form-group">

          {/* ── Verifying in progress ── */}
          {pageState === "verifying" && (
            <FormHeader>Verifying your email…</FormHeader>
          )}

          {/* ── Successfully verified ── */}
          {pageState === "verified" && (
            <>
              <FormHeader>Email verified!</FormHeader>
              <FormLabel>
                Your email address has been confirmed.
              </FormLabel>
              <FormLabel style={{ marginTop: "12px" }}>
                Because you registered with a non-OSU email address, your account
                still requires approval from the Mentor Match team before you can
                log in. Once approved, you will receive an email with a link to
                complete your profile setup.
              </FormLabel>
            </>
          )}

          {/* ── Error applying code ── */}
          {pageState === "error" && (
            <>
              <FormHeader>Verification link invalid or expired</FormHeader>
              <FormLabel>
                This link may have already been used or has expired. Use the button
                below to request a new one.
              </FormLabel>
              <FormControl className="form-control">
                {!emailSent ? (
                  <SubmitButton onClick={handleResendEmail} text="Resend email verification" widthMulti={0.2} />
                ) : (
                  <FormLabel>Email sent!</FormLabel>
                )}
              </FormControl>
            </>
          )}

          {/* ── Just signed up, pending admin approval (no oobCode yet) ── */}
          {pageState === "pending" && (
            <>
              <FormHeader>Account created — a couple of steps remain</FormHeader>
              <FormLabel>
                You should have received an email from us containing a link to
                verify your address. Please click that link to confirm your email.
              </FormLabel>
              <FormLabel style={{ marginTop: "12px" }}>
                Because you registered with a non-OSU email address, your account
                also requires approval from the Mentor Match team. Once approved,
                you will receive a second email with a link to complete your
                profile setup.
              </FormLabel>
              <FormControl className="form-control">
                {!emailSent ? (
                  <SubmitButton onClick={handleResendEmail} text="Resend email verification" widthMulti={0.2} />
                ) : (
                  <FormLabel>Email sent!</FormLabel>
                )}
              </FormControl>
            </>
          )}

          {/* ── Already verified OSU user landing here ── */}
          {pageState === "resend" && (
            <>
              <FormHeader>To continue, verify your email address</FormHeader>
              <FormLabel>
                You should have received an email from us containing a link to
                complete verification.
              </FormLabel>
              <FormLabel style={{ marginTop: "4px" }}>
                If the email has not arrived within a few minutes, use the button
                below to have it resent.
              </FormLabel>
              <FormControl className="form-control">
                {!emailSent ? (
                  <SubmitButton onClick={handleResendEmail} text="Resend email verification" widthMulti={0.2} />
                ) : (
                  <FormLabel>Email sent!</FormLabel>
                )}
              </FormControl>
            </>
          )}

        </FormGroup>
      </div>
    </div>
  );
}

export default VerifyEmail;

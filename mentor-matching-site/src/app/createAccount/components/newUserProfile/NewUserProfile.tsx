import authService from "../../../../service/authService";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import { refreshNavigate } from "../../../common/auth/refreshNavigate";
import UserAgreementForm from "./components/UserAgreementForm";
import ErrorMessage, { ErrorState } from "../../../common/forms/ErrorMessage";
import VerifyEmail from "../VerifyEmail";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import userService from "../../../../service/userService";
import { initUserProfile, UserProfile } from "../../../../types/userProfile";
import { updateProfile } from "../../../../redux/reducers/userProfileReducer";
import { Button } from "@mui/material";
import TextInputControlRedux from "../../../common/forms/textInputs/TextInputControlRedux";
import {
  updateFirstName, updateLastName, updateMiddleName,
  updateRole, updateHoursPerWeek, updateCredentials,
  updateCurrentProfession, updateCollegeYear,
  updatePersonalDegreeProgram, updateDisplayName,
  updatePronouns, updateTimeZone
} from "../../../../redux/reducers/userProfileReducer";
import SelectHoursPerWeek from "../../../userProfileCommon/dropdowns/SelectHoursPerWeek";
import SelectRole from "../../../userProfileCommon/dropdowns/SelectRole";
import SelectCredentials from "../../../userProfileCommon/dropdowns/SelectCredentials";
import SelectCollegeYear from "../../../userProfileCommon/dropdowns/SelectCollegeYear";
import SelectTimeZone from "../../../userProfileCommon/dropdowns/SelectTimeZone";
import SelectDegreeProgram from "../../../userProfileCommon/dropdowns/SelectDegreeProgram";
import FormGroupRows from "../../../common/forms/layout/FormGroupRows";
import FormGroupCols from "../../../common/forms/layout/FormGroupCols";
import "./NewUserProfile.css";

enum FormStep {
  VerifyEmail,
  ProfileForm,
  UserAgreement
}

const IconContact = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);

const IconPerson = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function NewUserProfile() {
  const [currentStep, setCurrentStep] = useState(FormStep.VerifyEmail);
  const [userHasAgreed, updateUserHasAgreed] = useState(false);
  const [errorState, setErrorState] = useState({ errorMessage: '', isError: false } as ErrorState);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);

  const selector = useAppSelector;
  const userProfile = selector(state => state.userProfile.userProfile);
  const personalInformation = selector(state => state.userProfile.userProfile?.personal ?? {} as any);
  const contactInformation = selector(state => state.userProfile.userProfile?.contact ?? {} as any);
  const availability = selector(state => state.userProfile.userProfile?.availability ?? {} as any);
  const userPreferences = selector(state => state.userProfile.userProfile?.preferences ?? {} as any);

  let intervalTimer = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    function loadProfile() {
      const userProfile: UserProfile = initUserProfile();
      dispatch(updateProfile(userProfile));
    }
    loadProfile();
  }, [dispatch]);

  useEffect(() => {
    const checkUserVerification = async () => {
      try {
        const user = await authService.getSignedInUser();
        if (user) {
          if (user.emailVerified) {
            await authService.refreshToken();
            setCurrentStep(FormStep.ProfileForm);
          } else {
            if (!intervalTimer.current) {
              intervalTimer.current = setInterval(async () => {
                await user.reload();
                if (user.emailVerified) {
                  await authService.refreshToken();
                  refreshNavigate('/');
                  if (intervalTimer.current) {
                    clearInterval(intervalTimer.current);
                    intervalTimer.current = null;
                  }
                }
              }, 5000);
            }
          }
        }
      } catch (error) {
        console.error("Failed to check user verification status:", error);
        if (intervalTimer.current) {
          clearInterval(intervalTimer.current);
          intervalTimer.current = null;
        }
      }
    };

    if (!intervalTimer.current) {
      checkUserVerification();
    }

    return () => {
      if (intervalTimer.current) {
        clearInterval(intervalTimer.current);
        intervalTimer.current = null;
      }
    };
  }, []);

  const resetError = () => {
    setErrorState({ errorMessage: '', isError: false } as ErrorState);
  };

  const validateProfileForm = (): string | null => {
    // Contact validation
    if (!userProfile?.contact?.displayName?.trim())
      return 'Display Name is required';
    if (!userProfile?.contact?.pronouns?.trim())
      return 'Pronouns are required';
    if (!userProfile?.contact?.timeZone?.trim())
      return 'Time Zone is required';

    // Personal validation
    if (!userProfile?.personal?.firstName?.trim())
      return 'First Name is required';
    if (!userProfile?.personal?.lastName?.trim())
      return 'Last Name is required';
    if (!userProfile?.preferences?.role?.trim())
      return 'Role is required';
    if (!userProfile?.availability?.hoursPerWeek?.trim())
      return 'Hours Available Per Week is required';

    // Mentor-specific validation
    if (userProfile?.preferences?.role === 'Mentor') {
      if (!userProfile?.personal?.credentials?.trim())
        return 'Credentials are required for mentors';
      if (!userProfile?.personal?.currentProfession?.trim())
        return 'Current Profession is required for mentors';
    }

    // Mentee-specific validation
    if (userProfile?.preferences?.role === 'Mentee') {
      if (!userProfile?.personal?.collegeYear?.trim())
        return 'College Year is required for mentees';
      if (!userProfile?.personal?.degreeProgram?.trim())
        return 'Degree Program is required for mentees';
    }

    return null;
  };

  const handleProfileFormSubmit = () => {
    resetError();
    const error = validateProfileForm();
    if (error) {
      setErrorState({ errorMessage: error, isError: true });
      return;
    }
    setCurrentStep(FormStep.UserAgreement);
  };

  const userHasAcceptedTerms = (agreed: boolean) => {
    updateUserHasAgreed(agreed);
  };

  async function profileSubmit() {
    resetError();

    // Re-validate all fields before final submission
    const error = validateProfileForm();
    if (error) {
      setErrorState({ errorMessage: error, isError: true });
      return;
    }

    if (!userHasAgreed) {
      setErrorState({ errorMessage: 'You must agree to the terms of service before continuing', isError: true });
      return;
    }

    setCreateAccountLoading(true);

    try {
      const user = await authService.getSignedInUser();
      if (user) {
        await userService.createNewUser(user, userProfile);
        setTimeout(() => {
          refreshNavigate('/');
          setCreateAccountLoading(false);
        }, 2000);
      } else {
        setCreateAccountLoading(false);
      }
    } catch (error) {
      console.error('Failed to create a new user:', error);
      setCreateAccountLoading(false);
    }
  }

  if (currentStep === FormStep.VerifyEmail) {
    return (
      <div className='login'>
        <VerifyEmail />
      </div>
    );
  }

  if (currentStep === FormStep.UserAgreement) {
    return (
      <div className="new-user-profile-page">
        <div className="new-profile-action-bar">
          <h2>Create Your Account</h2>
          <Button onClick={() => setCurrentStep(FormStep.ProfileForm)}>← Back</Button>
        </div>
        <UserAgreementForm
          updateAgreementAcceptance={userHasAcceptedTerms}
          userHasAgreed={userHasAgreed}
          submit={profileSubmit}
        />
        <ErrorMessage errorState={errorState} />
        <LoadingMessage message="Creating profile..." loading={createAccountLoading} />
      </div>
    );
  }

  return (
    <div className="new-user-profile-page">

      {/* ── Action Bar ── */}
      <div className="new-profile-action-bar">
        <h2>Finish Creating Your Profile</h2>
        <Button
          className="new-profile-submit-btn"
          onClick={handleProfileFormSubmit}
        >
          Continue to Agreement →
        </Button>
      </div>

      {/* ── Contact Information ── */}
      <div className="new-profile-section-card">
        <div className="new-profile-section-header">
          <span className="new-profile-section-icon"><IconContact /></span>
          <h3>Contact Information</h3>
        </div>
        <div className="new-profile-section-body">
          <FormGroupCols>
            <div className="new-profile-field-wrapper">
              <span className="new-profile-field-label">Display Name *</span>
              <TextInputControlRedux
                value={contactInformation.displayName}
                onInputDispatch={updateDisplayName}
              />
            </div>
            <div className="new-profile-field-wrapper">
              <span className="new-profile-field-label">Pronouns *</span>
              <TextInputControlRedux
                value={contactInformation.pronouns}
                onInputDispatch={updatePronouns}
              />
            </div>
            <div className="new-profile-field-wrapper">
              <span className="new-profile-field-label">Time Zone *</span>
              <SelectTimeZone
                onSelectDispatch={updateTimeZone}
                currentValue={contactInformation.timeZone}
              />
            </div>
          </FormGroupCols>
        </div>
      </div>

      {/* ── Personal Information ── */}
      <div className="new-profile-section-card">
        <div className="new-profile-section-header">
          <span className="new-profile-section-icon"><IconPerson /></span>
          <h3>Personal Information</h3>
        </div>
        <div className="new-profile-section-body no-scroll">
          <FormGroupCols>

            {/* Name fields side by side */}
            <FormGroupRows>
              <TextInputControlRedux value={personalInformation.firstName} label="First Name *" onInputDispatch={updateFirstName} />
              <TextInputControlRedux value={personalInformation.middleName} label="Middle Name" onInputDispatch={updateMiddleName} />
              <TextInputControlRedux value={personalInformation.lastName} label="Last Name *" onInputDispatch={updateLastName} />
            </FormGroupRows>

            {/* Role */}
            <div className="new-profile-field-wrapper">
              <span className="new-profile-field-label">Role *</span>
              <SelectRole onSelectDispatch={updateRole} currentValue={userPreferences.role} />
            </div>

            {/* Availability */}
            <div className="new-profile-field-wrapper">
              <span className="new-profile-field-label">Hours Available Per Week *</span>
              <SelectHoursPerWeek onSelectDispatch={updateHoursPerWeek} currentValue={availability.hoursPerWeek} />
            </div>

            {/* Mentor-specific fields */}
            {userPreferences.role === 'Mentor' && (
              <>
                <div className="new-profile-field-wrapper">
                  <span className="new-profile-field-label">Credentials *</span>
                  <SelectCredentials onSelectDispatch={updateCredentials} currentValue={personalInformation.credentials} />
                </div>
                <div className="new-profile-field-wrapper">
                  <span className="new-profile-field-label">Current Profession *</span>
                  <TextInputControlRedux
                    value={personalInformation.currentProfession || ''}
                    onInputDispatch={updateCurrentProfession}
                  />
                </div>
              </>
            )}

            {/* Mentee-specific fields */}
            {userPreferences.role === 'Mentee' && (
              <>
                <div className="new-profile-field-wrapper">
                  <span className="new-profile-field-label">College Year *</span>
                  <SelectCollegeYear onSelectDispatch={updateCollegeYear} currentValue={personalInformation.collegeYear} />
                </div>
                <div className="new-profile-field-wrapper">
                  <span className="new-profile-field-label">Degree Program *</span>
                  <SelectDegreeProgram
                    onSelectDispatch={updatePersonalDegreeProgram}
                    currentValue={personalInformation.degreeProgram}
                  />
                </div>
              </>
            )}

          </FormGroupCols>
        </div>
      </div>

      <ErrorMessage errorState={errorState} />
      <LoadingMessage message="Creating profile..." loading={createAccountLoading} />
    </div>
  );
}

export default NewUserProfile;

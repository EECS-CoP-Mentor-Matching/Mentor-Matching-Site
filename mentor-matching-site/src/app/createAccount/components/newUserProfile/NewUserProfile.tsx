import authService from "../../../../service/authService";
import { useState } from "react";
import FormGroupCols from "../../../common/forms/layout/FormGroupCols";
import NewUserContactInformation from "./components/NewUserContactInformation";
import NewUserPersonalInformation from "./components/NewUserPersonalInformation";
import NewUserDemographicInformation from "./components/NewUserDemographicInformation";
import NewUserEducationInformation from "./components/NewUserEducationInformation";
import NewUserSubmit from "./components/NewUserSubmit";
import NewUserNavigation from "./components/NewUserNavigation";
import userService from "../../../../service/userService";
import { useAppSelector } from "../../../../redux/hooks";
import { refreshNavigate } from "../../../common/auth/refreshNavigate";
import UserAgreementForm from "./components/UserAgreementForm";
import ErrorMessage, { ErrorState } from "../../../common/forms/ErrorMessage";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import PopupMessage from "../../../common/forms/modals/PopupMessage";
import { useNavigate } from "react-router-dom";

enum FormStep {
  Contact = 1,
  Demographic = 2,
  Educational = 3,
  Personal = 4,
  UserAgreement = 5,
  Submit = 6,
  AccountCreated = 7
}

function NewUserProfile() {
  const [currentStep, setCurrentStep] = useState(FormStep.Contact);
  const [userHasAgreed, updateUserHasAgreed] = useState(false);
  const [errorState, setErrorState] = useState({ errorMessage: '', isError: false } as ErrorState);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  const selector = useAppSelector;
  const userProfile = selector(state => state.userProfile.userProfile);
  const email = selector(state => state.userProfile.userProfile.contact.email);

  async function createNewUser(password: string) {
    setCreateAccountLoading(true);

    console.log(userProfile);
    try {
      const user = await authService.createUser(email, password);
      if (user) {
        await userService.createNewUser(user, userProfile);
        const userCreated = await userService.getUserProfile(user.uid);
        if (userCreated) {
          setAccountCreated(true);
        }
      }
    } catch (error) {
      // delete the user from firebase?
      console.error('Failed to create a new user:', error);
    }

    setCreateAccountLoading(false);
  }

  const resetError = () => {
    setErrorState({ errorMessage: '', isError: false } as ErrorState);
  }

  const nextStep = () => {
    resetError();

    if (currentStep === FormStep.UserAgreement && !userHasAgreed) {
      setErrorState({ errorMessage: 'You must agree to the terms of service before continuing', isError: true });
      return;
    }

    if (currentStep >= FormStep.Contact && currentStep < FormStep.Submit) {
      setCurrentStep(currentStep + 1);
    }
  }

  const previousStep = () => {
    resetError();

    if (currentStep > FormStep.Contact) {
      setCurrentStep(currentStep - 1);
    }
  }

  const userHasAcceptedTerms = (agreed: boolean) => {
    updateUserHasAgreed(agreed);
  }

  const loadCurrentFormStep = () => {
    switch (currentStep) {
      case FormStep.Contact:
        return <NewUserContactInformation />
      case FormStep.Demographic:
        return <NewUserDemographicInformation />
      case FormStep.Educational:
        return <NewUserEducationInformation />
      case FormStep.Personal:
        return <NewUserPersonalInformation />
      case FormStep.UserAgreement:
        return <UserAgreementForm updateAgreementAcceptance={userHasAcceptedTerms} userHasAgreed={userHasAgreed} />
      case FormStep.Submit:
        return <NewUserSubmit createNewUser={createNewUser} />
      default:
        return (
          <div>Invalid step</div>
        )
    }
  }

  const navigateToProfile = () => {
    refreshNavigate('/update-profile');
  }

  return (
    <div className='login'>
      <FormGroupCols>
        {loadCurrentFormStep()}
        <ErrorMessage errorState={errorState} />
        <NewUserNavigation nextStep={nextStep}
          hideNext={currentStep === FormStep.Submit}
          previousStep={previousStep}
          hidePrevious={currentStep === FormStep.Contact}
        />
      </FormGroupCols>
      <LoadingMessage message="Creating your account.... Don't refresh!" loading={createAccountLoading} />
      <PopupMessage message="Your account was created!" hideX={true}
        open={accountCreated} setIsOpen={setAccountCreated}
        actionButton={navigateToProfile} actionMessage="View Profile"
      />
    </div>
  );
}

export default NewUserProfile;
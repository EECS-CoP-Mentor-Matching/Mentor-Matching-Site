import authService from "../../../../service/authService";
import { useState } from "react";
import FormGroupCols from "../../../common/forms/layout/FormGroupCols";
import NewUserContactInformation from "./components/NewUserContactInformation";
import NewUserPersonalInformation from "./components/NewUserPersonalInformation";
import NewUserDemographicInformation from "./components/NewUserDemographicInformation";
import NewUserEducationInformation from "./components/NewUserEducationInformation";
import NewUserPreferences from "./components/NewUserPreferences";
import NewUserSubmit from "./components/NewUserSubmit";
import NewUserNavigation from "./components/NewUserNavigation";
import userService from "../../../../service/userService";
import { useAppSelector } from "../../../../redux/hooks";
import { refreshNavigate } from "../../../common/auth/refreshNavigate";
import UserAgreementForm from "./components/UserAgreementForm";
import ErrorMessage, { ErrorState } from "../../../common/forms/ErrorMessage";

enum FormStep {
  Contact = 1,
  Demographic = 2,
  Educational = 3,
  Personal = 4,
  Preferences = 5,
  UserAgreement = 6,
  Submit = 7,
  AccountCreated = 8
}

function NewUserProfile() {
  const [currentStep, setCurrentStep] = useState(FormStep.Contact);
  const [userHasAgreed, updateUserHasAgreed] = useState(false);
  const [errorState, setErrorState] = useState({ errorMessage: '', isError: false } as ErrorState);
  const selector = useAppSelector;
  const userProfile = selector(state => state.userProfile.userProfile);
  const email = selector(state => state.userProfile.userProfile.contact.email);

  async function createNewUser(password: string) {
    console.log(userProfile);
    try {
      const user = await authService.createUser(email, password);
      if (user) {
        await userService.createNewUser(user, userProfile);
        const userCreated = await userService.getUserProfile(user.uid);
      }
    } catch (error) {
      // delete the user from firebase?
      console.error('Failed to create a new user:', error);
    }
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
      case FormStep.Preferences:
        return <NewUserPreferences />
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
    </div>
  );
}

export default NewUserProfile;
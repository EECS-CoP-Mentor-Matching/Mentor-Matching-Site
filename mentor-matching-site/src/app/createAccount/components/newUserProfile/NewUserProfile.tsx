import authService from "../../../../service/authService";
import {useEffect, useRef, useState} from "react";
import FormGroupCols from "../../../common/forms/layout/FormGroupCols";
import NewUserContactInformation from "./components/NewUserContactInformation";
import NewUserPersonalInformation from "./components/NewUserPersonalInformation";
import NewUserNavigation from "./components/NewUserNavigation";
import {useAppDispatch, useAppSelector} from "../../../../redux/hooks";
import { refreshNavigate } from "../../../common/auth/refreshNavigate";
import UserAgreementForm from "./components/UserAgreementForm";
import ErrorMessage, { ErrorState } from "../../../common/forms/ErrorMessage";
import VerifyEmail from "../VerifyEmail";
import FormHeader from "../../../common/forms/layout/FormHeader";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import userService from "../../../../service/userService";
import {initUserProfile, UserProfile} from "../../../../types/userProfile";
import {updateProfile} from "../../../../redux/reducers/userProfileReducer";

enum FormStep {
  VerifyEmail,
  Contact,
  Personal,
  UserAgreement
}

function NewUserProfile() {
  const [currentStep, setCurrentStep] = useState(FormStep.VerifyEmail);
  const [userHasAgreed, updateUserHasAgreed] = useState(false);
  const [errorState, setErrorState] = useState({ errorMessage: '', isError: false } as ErrorState);
  const [createAccountLoading, setCreateAccountLoading] = useState(false);

  const selector = useAppSelector;
  const userProfile = selector(state => state.userProfile.userProfile)

  let intervalTimer = useRef<NodeJS.Timeout | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    loadProfile();
  }, [dispatch]);

  function loadProfile() {
    const userProfile: UserProfile = initUserProfile();

    dispatch(updateProfile(userProfile));
  }


  useEffect(() => {

    const checkUserVerification = async () => {
      try {
        const user = await authService.getSignedInUser();
        if (user) {
          if (user.emailVerified) {
            await authService.refreshToken();
            setCurrentStep(FormStep.Contact);
          } else {
            if (!intervalTimer.current) {
              intervalTimer.current = setInterval(async () => {
                await user.reload();
                if (user.emailVerified) {
                  await authService.refreshToken();
                  refreshNavigate('/')
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
  }

  const nextStep = () => {
    resetError();

    if (currentStep >= FormStep.Contact && currentStep < FormStep.UserAgreement) {
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

  async function profileSubmit ()  {
    resetError();

    if (currentStep === FormStep.UserAgreement && !userHasAgreed) {
      setErrorState({ errorMessage: 'You must agree to the terms of service before continuing', isError: true });
      return;
    }

    setCreateAccountLoading(true)

    try {
      const user = await authService.getSignedInUser()
      if (user) {
        await userService.createNewUser(user, userProfile);
        setTimeout(() => {
          refreshNavigate('/')
          setCreateAccountLoading(false);
        }, 2000);
      } else {
        setCreateAccountLoading(false);
      }
    } catch (error) {
      // delete the user from firebase?
      console.error('Failed to create a new user:', error);
      setCreateAccountLoading(false);
    }
  }

  const loadCurrentFormStep = () => {
    switch (currentStep) {
      case FormStep.VerifyEmail:
        return <VerifyEmail />
      case FormStep.Contact:
        return <NewUserContactInformation />
      case FormStep.Personal:
        return <NewUserPersonalInformation />
      case FormStep.UserAgreement:
        return <UserAgreementForm updateAgreementAcceptance={userHasAcceptedTerms} userHasAgreed={userHasAgreed}
        submit={profileSubmit}/>
      default:
        return (
          <div>Invalid step</div>
        )
    }
  }

  return (
        <div className='login'>
          <FormGroupCols>
            <FormHeader>Finish creating your profile:</FormHeader>
            {loadCurrentFormStep()}
            <ErrorMessage errorState={errorState} />
            <NewUserNavigation nextStep={nextStep}
              hideNext={currentStep < FormStep.Contact || currentStep === FormStep.UserAgreement}
              previousStep={previousStep}
              hidePrevious={currentStep < FormStep.Personal}
            />
          </FormGroupCols>
          <LoadingMessage message="Creating profile..." loading={createAccountLoading} />
        </div>
  );
}

export default NewUserProfile;
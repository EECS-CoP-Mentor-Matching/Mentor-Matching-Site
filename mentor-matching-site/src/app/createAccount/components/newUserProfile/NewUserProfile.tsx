import { FormControl, Button, FormLabel, FormGroup, Input, InputLabel } from "@mui/material";
import SelectTimeZone from "../../../userProfileCommon/dropdowns/SelectTimeZone";
import authService from "../../../../service/authService";
import TextInputControl from "../../../common/forms/textInputs/TextInputControl";
import { useState } from "react";
import FormGroupCols from "../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../common/forms/layout/FormGroupRows";
import NewUserContactInformation from "./components/NewUserContactInformation";
import NewUserPersonalInformation from "./components/NewUserPersonalInformation";
import NewUserDemographicInformation from "./components/NewUserDemographicInformation";
import NewUserEducationInformation from "./components/NewUserEducationInformation";
import NewUserPreferences from "./components/NewUserPreferences";
import { UserContactInformation, UserDemographicInformation, UserEducationInformation, UserPersonalInformation, UserProfile } from "../../../../types/userProfile";
import { UserPreferences } from "typescript";
import NewUserSubmit from "./components/NewUserSubmit";
import NewUserNavigation from "./components/NewUserNavigation";
import userService from "../../../../service/userService";
import { useNavigate } from "react-router-dom";
import UpdateUserContactInformation from "../../../updateUserProfile/components/UpdateUserContactInformation";
import { useAppSelector } from "../../../../redux/hooks";
import UpdateUserDemographicInformation from "../../../updateUserProfile/components/UpdateDemographicsInformation";

enum FormStep {
  Contact = 1,
  Demographic = 2,
  Educational = 3,
  Personal = 4,
  Preferences = 5,
  Submit = 6
}

interface NewUserProfileProps {
  setSignedIn: (signedIn: boolean) => void
}

function NewUserProfile({ setSignedIn }: NewUserProfileProps) {
  const [currentStep, setCurrentStep] = useState(FormStep.Contact);
  const navigate = useNavigate();
  const selector = useAppSelector;
  const userProfile = selector(state => state.profile.userProfile);
  const email = selector(state => state.profile.userProfile.contact.email);

  async function createNewUser(password: string) {
    try {
      const user = await authService.createUser(email, password);
      if (user) {
        const uid = user.uid;
        // const userProfile = {
        //   UID: uid,
        //   contact: contactInformation,
        //   personal: personalInformation,
        //   demographics: demographicInformation,
        //   education: educationInformation,
        //   preferences: userPreferences,
        // } as UserProfile;
        // await userService.createNewUser(userProfile);

        setSignedIn(true);
        navigate("/");
      }
    } catch (error) {
      console.error('Failed to create a new user:', error);
      // Handle error (show message to user, etc.)
    }
  }

  function nextStep() {
    if (currentStep >= FormStep.Contact && currentStep < FormStep.Submit) {
      setCurrentStep(currentStep + 1);
    }
  }

  function previousStep() {
    if (currentStep > FormStep.Contact) {
      setCurrentStep(currentStep - 1);
    }
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
        <NewUserNavigation nextStep={nextStep}
          hideNext={currentStep == FormStep.Submit}
          previousStep={previousStep}
          hidePrevious={currentStep == FormStep.Contact} />
      </FormGroupCols>
    </div>
  );
}

export default NewUserProfile;
import { FormControl, Button, FormLabel, FormGroup, Input, InputLabel } from "@mui/material";
import SelectTimeZone from "./components/SelectTimeZone";
import authService from "../../../../service/authService";
import TextInputControl from "../../../common/forms/TextInputControl";
import { useState } from "react";
import FormGroupCols from "../../../common/forms/FormGroupCols";
import FormGroupRows from "../../../common/forms/FormGroupRows";
import NewUserContactInformation from "./components/NewUserContactInformation";
import NewUserPersonalInformation from "./components/NewUserPersonalInformation";
import NewUserDemographicInformation from "./components/NewUserDemographicInformation";
import NewUserEducationInformation from "./components/NewUserEducationInformation";
import NewUserPreferences from "./components/NewUserPreferences";
import { UserContactInformation, UserDemographicInformation, UserEducationInformation, UserPersonalInformation, UserProfile } from "../../../../types";
import { UserPreferences } from "typescript";
import NewUserSubmit from "./components/NewUserSubmit";
import NewUserNavigation from "./components/NewUserNavigation";
import userService from "../../../../service/userService";
import { useNavigate } from "react-router-dom";

enum FormStep {
  Contact = 1,
  Demographic = 2,
  Educational = 3,
  Personal = 4,
  Preferences = 5,
  Submit = 6
}

interface NewUserProfileProps {
  email: string
  setSignedIn: (signedIn: boolean) => void
}

function NewUserProfile(props: NewUserProfileProps) {
  const [currentStep, setCurrentStep] = useState(FormStep.Contact);
  const [contactInformation, setContactInformation] = useState<UserContactInformation>({ email: props.email } as UserContactInformation);
  const [personalInformation, setPersonalInformation] = useState<UserPersonalInformation>({} as UserPersonalInformation);
  const [demographicInformation, setDemographicInformation] = useState<UserDemographicInformation>({} as UserDemographicInformation);
  const [educationInformation, setEducationInformation] = useState<UserEducationInformation>({} as UserEducationInformation);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({} as UserPreferences);
  const navigate = useNavigate();

  async function createNewUser(password: string) {
    console.log("Contact: ", contactInformation);
    console.log("Personal: ", personalInformation);
    console.log("Demographic: ", demographicInformation);
    console.log("Education: ", educationInformation);

    try {
      const user = await authService.createUser(props.email, password);
      if (user) {
        const uid = user.uid;
        const userProfile = {
          UID: uid,
          contact: contactInformation,
          personal: personalInformation,
          demographics: demographicInformation,
          education: educationInformation,
          preferences: userPreferences,
        } as UserProfile;
        await userService.createNewUser(userProfile);

        props.setSignedIn(true);
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
        return <NewUserContactInformation
          contactInformation={contactInformation}
          setContactInformation={setContactInformation} />
      case FormStep.Demographic:
        return <NewUserDemographicInformation
          demographicInformation={demographicInformation}
          setDemographicInformation={setDemographicInformation} />
      case FormStep.Educational:
        return <NewUserEducationInformation
          educationInformation={educationInformation}
          setEducationInformation={setEducationInformation} />
      case FormStep.Personal:
        return <NewUserPersonalInformation
          personalInformation={personalInformation}
          setPersonalInformation={setPersonalInformation} />
      case FormStep.Preferences:
        return <NewUserPreferences
          userPreferences={userPreferences}
          setUserPreferences={setUserPreferences} />
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
import { updateEmail } from "../../../redux/reducers/profileReducer";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";

interface EmailProps {
  submitEmail: () => void
  emailValidation: (email: string) => boolean
}

function Email({ submitEmail, emailValidation }: EmailProps) {
  return (
    <TextInputControlRedux
      onInputDispatch={updateEmail}
      label="Email"
      onSubmit={submitEmail}
      onSubmitValidation={emailValidation}
      widthMulti={.25} />
  );
}

export default Email;
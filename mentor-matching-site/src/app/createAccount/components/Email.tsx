import { updateEmail } from "../../../redux/reducers/userProfileReducer";
import TextInputControlRedux from "../../common/forms/textInputs/TextInputControlRedux";

interface EmailProps {
  submitEmail: () => void
}

function Email({ submitEmail }: EmailProps) {
  return (
    <TextInputControlRedux
      onInputDispatch={updateEmail}
      label="Email"
      onSubmit={submitEmail}
      widthMulti={.25} />
  );
}

export default Email;
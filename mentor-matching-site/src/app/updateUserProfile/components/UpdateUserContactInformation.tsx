import { useAppSelector } from "../../../redux/hooks";
import { updateDisplayName, updateEmail } from "../../../redux/reducers/profileReducer";
import FormGroupCols from "../../common/forms/FormGroupCols";
import FormGroupRows from "../../common/forms/FormGroupRows";
import TextInputControlRedux from "../../common/forms/TextInputControlRedux";

interface UpdateUserContactInformationProps {
  showEdit: boolean
}

function UpdateUserContactInformation({ showEdit }: UpdateUserContactInformationProps) {
  const selector = useAppSelector;
  const contactInformation = selector(state => state.profile.userProfile.contact);

  return (
    <>{contactInformation !== undefined &&
      <FormGroupCols>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.displayName} label="Display Name" readonly={!showEdit} onInputDispatch={updateDisplayName} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControlRedux value={contactInformation.email} label="Email" readonly={!showEdit} onInputDispatch={updateEmail} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserContactInformation;
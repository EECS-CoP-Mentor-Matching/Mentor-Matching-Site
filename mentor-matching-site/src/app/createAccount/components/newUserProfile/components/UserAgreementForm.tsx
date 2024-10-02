import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import TextDisplaySection from "../../../../common/forms/textInputs/TextDisplaySection";
import TextDisplayHeader from "../../../../common/forms/textInputs/TextDisplayHeader";
import TextDisplay from "../../../../common/forms/textInputs/TextDisplay";
import CheckBoxControl from "../../../../common/forms/checkbox/CheckBoxControl";
import DocuSignButton from "../../DocuSign/DocuSignButton";
import {FormControl} from "@mui/material";
import SubmitButton from "../../../../common/forms/buttons/SubmitButton";

interface UserAgreementFormProps {
  updateAgreementAcceptance: (checked: boolean) => void
  userHasAgreed: boolean
  submit: () => void
}

function UserAgreementForm({ updateAgreementAcceptance, userHasAgreed, submit }: UserAgreementFormProps) {

  return (
    <FormGroupCols>
      <TextDisplaySection>
        <TextDisplayHeader headerType="h3" >
          User Code of Conduct
        </TextDisplayHeader>
        <TextDisplay widthMulti={.30}>
          • You will not post content that insults, defames, harasses, threatens, or discriminates against other users on the site.<br />
          • You will not post content that would encourage or entice any action or conduct that would result in a criminal offense, or give rise to civil liability.<br />
          • You will not share personal information including contact information with other third parties.
        </TextDisplay>
        <TextDisplayHeader headerType="h3" >
          Registration to Use Services
        </TextDisplayHeader>
        <TextDisplayHeader headerType="h4" >
          Information liable to be shared with other users upon matching
        </TextDisplayHeader>
        <TextDisplay widthMulti={.30}>
          • Name Provided in the Application (does not have to be legal name)<br />
          • Contact information (phone number, email address, social media links)<br />
          • General location via time zone.
        </TextDisplay>
        <TextDisplayHeader headerType="h3" >
          Right to Terminate
        </TextDisplayHeader>
        <TextDisplay widthMulti={.30}>
          • This site reserves the right to terminate an account for any reason<br />
        </TextDisplay>
      </TextDisplaySection>
      <TextDisplay widthMulti={.30}>In order to continue with creating your account you must agree to these services.</TextDisplay>
      <CheckBoxControl label="Click here to agree." onChange={updateAgreementAcceptance} checked={userHasAgreed} />
      <DocuSignButton />
      <FormControl className="form-control">
        <SubmitButton onClick={submit} text="Submit" widthMulti={.15} />
      </FormControl>
    </FormGroupCols>
  );
}

export default UserAgreementForm;
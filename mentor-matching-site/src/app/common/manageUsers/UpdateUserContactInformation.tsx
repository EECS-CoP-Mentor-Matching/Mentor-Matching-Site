import { FormLabel, Select } from "@mui/material";
import FormGroupCols from "../forms/layout/FormGroupCols";
import FormGroupRows from "../forms/layout/FormGroupRows";
import TextDisplay from "../forms/textInputs/TextDisplay";
import SelectTimeZone from "./SelectTimezone";
import { UserProfile } from "../../../types/userProfile";
import TextInputControl from "../forms/textInputs/TextInputControl";
import { isValidEmail } from "./../forms/validation";

interface UpdateUserContactInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;
}

function UpdateUserContactInformation({ showEdit, showEditStyle, userProfile, onChange }: UpdateUserContactInformationProps) {
  const contactInformation = userProfile.contact

  const updateContactField = (field: keyof typeof contactInformation, value: string) =>
    onChange(
      {
        ...userProfile,
        contact: {
          ...contactInformation,
          [field]: value
        }
      }
    );

  const emailIsInvalid = showEdit &&
    contactInformation.email?.trim() !== '' &&
    !isValidEmail(contactInformation.email);

  return (
    <>{contactInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Contact Information</FormLabel>
        <FormGroupRows>
          <TextInputControl
            value={contactInformation.email}
            label="Contact Email"
            readonly={!showEdit}
            onInput={(value) => updateContactField("email", value)}
            widthMulti={.15}
          />
        </FormGroupRows>
        {showEdit && (
          <p style={{ fontSize: '0.75rem', color: emailIsInvalid ? '#d32f2f' : '#666', margin: '-8px 0 8px 0' }}>
            {emailIsInvalid
              ? 'Please enter a valid email address.'
              : 'This email is shared with your matches and used by admins to contact you. It can differ from your login email.'}
          </p>
        )}
        <FormGroupRows>
          <TextInputControl value={contactInformation.displayName} label="Display Name" readonly={!showEdit} onInput={(value) => updateContactField("displayName", value)} widthMulti={.15} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControl value={contactInformation.pronouns} label="Pronouns" readonly={!showEdit} onInput={(value) => updateContactField("pronouns", value)} />
        </FormGroupRows>
        <FormGroupRows>
          <SelectTimeZone value={contactInformation.timeZone} onChange={(value) => updateContactField("timeZone", value)} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default UpdateUserContactInformation;

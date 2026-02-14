import { FormLabel, Select } from "@mui/material";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import TextDisplay from "../../../../common/forms/textInputs/TextDisplay";
import AdminSelectTimeZone from "./AdminSelectTimezone";
import { UserProfile } from "../../../../../types/userProfile";
import TextInputControl from "../../../../common/forms/textInputs/TextInputControl";

interface UpdateUserContactInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;
}

function AdminUpdateUserContactInformation({ showEdit, showEditStyle, userProfile, onChange }: UpdateUserContactInformationProps) {
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

  return (
    <>{contactInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Contact Information</FormLabel>
        <FormGroupRows>
          <TextDisplay label="Email" widthMulti={.15}>
            {contactInformation.email}
          </TextDisplay>
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControl value={contactInformation.displayName} label="Display Name" readonly={!showEdit} onInput={(value) => updateContactField("displayName", value)} style={showEditStyle} widthMulti={.15} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControl value={contactInformation.pronouns} label="Pronouns" readonly={!showEdit} onInput={(value) => updateContactField("pronouns", value)} style={showEditStyle} />
          <AdminSelectTimeZone value={contactInformation.timeZone} onChange={(value) => updateContactField("timeZone", value)} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}
export default AdminUpdateUserContactInformation;
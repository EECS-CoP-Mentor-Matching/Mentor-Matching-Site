import FormGroupRows from "../forms/layout/FormGroupRows";
import FormGroupCols from "../forms/layout/FormGroupCols";
import { FormLabel } from "@mui/material";
import { UserProfile } from "../../../types/userProfile";
import TextInputControl from "../forms/textInputs/TextInputControl";

interface UpdatePersonalInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;
}

function AdminUpdatePersonalInformation({ showEdit, showEditStyle, userProfile, onChange }: UpdatePersonalInformationProps) {
  //const personalInformation = selector(state => state.userProfile.userProfile.personal);
  const personalInformation = userProfile.personal;

  const updateNameField = (field: keyof typeof personalInformation, value: string) =>
    onChange(
      {
        ...userProfile,
        personal: {
          ...personalInformation,
          [field]: value
        }
      }
    );

    const updateDobField = (field: keyof typeof personalInformation.dob, value: string) =>
      onChange(
        {
          ...userProfile,
          personal: {
            ...personalInformation,
            dob: {
              ...personalInformation.dob,
              [field]: value
            }
          }
        }
      )
  

  return (
    <>{personalInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Personal Information</FormLabel>
        <FormGroupRows>
          <TextInputControl value={personalInformation.firstName} label="First Name" readonly={!showEdit} onInput={(value) => updateNameField("firstName", value)} style={showEditStyle}/>
          <TextInputControl value={personalInformation.middleName} label="Middle Name" readonly={!showEdit} onInput={(value) => updateNameField("middleName", value)} style={showEditStyle}/>
          <TextInputControl value={personalInformation.lastName} label="Last Name" readonly={!showEdit} onInput={(value) => updateNameField("lastName", value)} style={showEditStyle}/>
        </FormGroupRows>
        <FormGroupRows>
          <FormLabel>Date of Birth</FormLabel>
          <TextInputControl value={personalInformation.dob.month} onInput={(value) => updateDobField("month", value)} widthMulti={.025} />/
          <TextInputControl value={personalInformation.dob.day} onInput={(value) => updateDobField("day", value)} widthMulti={.025} />/
          <TextInputControl value={personalInformation.dob.year} onInput={(value) => updateDobField("year", value)} widthMulti={.05} />
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}

export default AdminUpdatePersonalInformation;
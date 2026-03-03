import { useAppSelector } from "../../../../../redux/hooks";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";
import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import TextInputControlRedux from "../../../../common/forms/textInputs/TextInputControlRedux";
import { updateFirstName, updateLastName, updateMiddleName, updateRole, updateHoursPerWeek, updateCredentials, updateCurrentProfession, updateCollegeYear, updatePersonalDegreeProgram } from "../../../../../redux/reducers/userProfileReducer";
import SelectHoursPerWeek from "../../../../userProfileCommon/dropdowns/SelectHoursPerWeek";
import SelectRole from "../../../../userProfileCommon/dropdowns/SelectRole";
import SelectCredentials from "../../../../userProfileCommon/dropdowns/SelectCredentials";
import SelectCollegeYear from "../../../../userProfileCommon/dropdowns/SelectCollegeYear";
import FormHeader from "../../../../common/forms/layout/FormHeader";
import FormSectionHeader from "../../../../common/forms/layout/FormSectionHeader";

function NewUserPersonalInformation() {
  const selector = useAppSelector;
  const personalInformation = selector(state => state.userProfile.userProfile.personal);
  const availability = selector(state => state.userProfile.userProfile.availability);
  const userPreferences = selector(state => state.userProfile.userProfile.preferences);

  return (
    <FormGroupCols>
      <FormHeader>Personal Information</FormHeader>
      
      <FormGroupRows>
        <TextInputControlRedux value={personalInformation.firstName} label="First Name" onInputDispatch={updateFirstName} />
        <TextInputControlRedux value={personalInformation.middleName} label="Middle Name" onInputDispatch={updateMiddleName} />
        <TextInputControlRedux value={personalInformation.lastName} label="Last Name" onInputDispatch={updateLastName} />
      </FormGroupRows>
      
      <FormGroupCols>
        <FormSectionHeader>Select Your Role</FormSectionHeader>
        <SelectRole onSelectDispatch={updateRole} currentValue={userPreferences.role} />
      </FormGroupCols>
      
      <FormGroupCols>
        <FormSectionHeader>Availability</FormSectionHeader>
        <SelectHoursPerWeek onSelectDispatch={updateHoursPerWeek} currentValue={availability.hoursPerWeek} />
      </FormGroupCols>

      {/* Mentor-specific fields */}
      {userPreferences.role === 'Mentor' && (
        <FormGroupCols>
          <FormSectionHeader>Professional Information</FormSectionHeader>
          <SelectCredentials onSelectDispatch={updateCredentials} currentValue={personalInformation.credentials} />
          <TextInputControlRedux 
            value={personalInformation.currentProfession || ''} 
            label="Current Profession *" 
            onInputDispatch={updateCurrentProfession}
          />
        </FormGroupCols>
      )}

      {/* Mentee-specific fields */}
      {userPreferences.role === 'Mentee' && (
        <FormGroupCols>
          <FormSectionHeader>Student Information</FormSectionHeader>
          <SelectCollegeYear onSelectDispatch={updateCollegeYear} currentValue={personalInformation.collegeYear} />
          <TextInputControlRedux 
            value={personalInformation.degreeProgram || ''} 
            label="Degree Program *" 
            onInputDispatch={updatePersonalDegreeProgram}
          />
        </FormGroupCols>
      )}
    </FormGroupCols>
  );
}

export default NewUserPersonalInformation;

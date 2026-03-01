import FormGroupRows from "../forms/layout/FormGroupRows";
import FormGroupCols from "../forms/layout/FormGroupCols";
import { FormControl, FormLabel, InputLabel, MenuItem, Select } from "@mui/material";
import { UserProfile, HOURS_PER_WEEK_OPTIONS } from "../../../types/userProfile";
import TextInputControl from "../forms/textInputs/TextInputControl";
import { useAppSelector } from "../../../redux/hooks";
import { MatchRole } from "../../../types/matchProfile";

interface UpdatePersonalInformationProps {
  showEdit: boolean,
  showEditStyle: any,
  userProfile: UserProfile,
  onChange: (updatedProfile: UserProfile) => void;
}

function UpdatePersonalInformation({ showEdit, showEditStyle, userProfile, onChange }: UpdatePersonalInformationProps) {
  const personalInformation = userProfile.personal;
  const availability = userProfile.availability;
  const userPreferences = userProfile.preferences;

  // Check if the LOGGED-IN user is an Admin
  const currentLoggedInUser = useAppSelector((state) => state.userProfile.userProfile);
  const isLoggedInUserAdmin = currentLoggedInUser?.preferences?.role === "Admin";

  // Determine which roles to show
  // Regular users: Mentee, Mentor, Both (no Admin)
  // Admins: Mentee, Mentor, Both, Admin
  const availableRoles = isLoggedInUserAdmin
    ? [MatchRole.mentee, MatchRole.mentor, MatchRole.both, "Admin"]
    : [MatchRole.mentee, MatchRole.mentor, MatchRole.both];

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

  const updateAvailabilityField = (field: keyof typeof availability, value: string) =>
    onChange(
      {
        ...userProfile,
        availability: {
          ...availability,
          [field]: value
        }
      }
    );

  const updateRoleField = (value: string) =>
    onChange(
      {
        ...userProfile,
        preferences: {
          ...userPreferences,
          role: value as any
        }
      }
    );

  return (
    <>{personalInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Personal Information</FormLabel>
        <FormGroupRows>
          <TextInputControl value={personalInformation.firstName} label="First Name" readonly={!showEdit} onInput={(value) => updateNameField("firstName", value)} style={showEditStyle}/>
          <TextInputControl value={personalInformation.middleName} label="Middle Name" readonly={!showEdit} onInput={(value) => updateNameField("middleName", value)} style={showEditStyle}/>
          <TextInputControl value={personalInformation.lastName} label="Last Name" readonly={!showEdit} onInput={(value) => updateNameField("lastName", value)} style={showEditStyle}/>
        </FormGroupRows>
        
        <FormLabel sx={{ mt: 2 }}>Role</FormLabel>
        <FormGroupRows>
          <FormControl fullWidth sx={{ minWidth: 250 }} disabled={!showEdit}>
            <InputLabel>User Role</InputLabel>
            <Select
              value={userPreferences.role || ""}
              onChange={(e) => updateRoleField(e.target.value)}
              label="User Role"
            >
              {availableRoles.map((role) => (
                <MenuItem key={String(role)} value={String(role)}>
                  {String(role)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroupRows>
        
        <FormLabel sx={{ mt: 2 }}>Availability</FormLabel>
        <FormGroupRows>
          <FormControl fullWidth sx={{ minWidth: 250 }} disabled={!showEdit}>
            <InputLabel>Hours Available Per Week</InputLabel>
            <Select
              value={availability?.hoursPerWeek || ""}
              onChange={(e) => updateAvailabilityField("hoursPerWeek", e.target.value)}
              label="Hours Available Per Week"
            >
              <MenuItem value="">
                <em>Select availability</em>
              </MenuItem>
              {HOURS_PER_WEEK_OPTIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </FormGroupRows>
      </FormGroupCols>
    }</>
  );
}

export default UpdatePersonalInformation;

import React, { useState } from "react";
import FormGroupRows from "../forms/layout/FormGroupRows";
import FormGroupCols from "../forms/layout/FormGroupCols";
import { 
  FormControl, FormLabel, InputLabel, MenuItem, Select, 
  Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button
} from "@mui/material";
import { UserProfile, HOURS_PER_WEEK_OPTIONS } from "../../../types/userProfile";
import TextInputControl from "../forms/textInputs/TextInputControl";
import { useAppSelector } from "../../../redux/hooks";
import { MatchRole, AdminMatchRole } from "../../../types/matchProfile";
import { CREDENTIALS, COLLEGE_YEARS } from "../../../config/matchingConfig";
import SelectDegreeProgram from "./SelectDegreeProgram";

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
  const isLoggedInUserAdmin = currentLoggedInUser?.preferences?.role === AdminMatchRole.admin;

  // New state for dialog options when updating user's role
  const [dialogConfig, setDialogConfig] = useState({ title: "", message: "" });
  const [openAdminDialog, setOpenAdminDialog] = useState(false);
  const [pendingRole, setPendingRole] = useState<string | null>(null);

  // Regular users: Mentee, Mentor, Both (no Admin)
  // Admins can also assign the Admin role
  const availableRoles = isLoggedInUserAdmin
    ? [MatchRole.mentee, MatchRole.mentor, MatchRole.both, AdminMatchRole.admin]
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

  const commitRoleChange = (role: string) => {
    onChange({
      ...userProfile,
      preferences: {
        ...userPreferences,
        role: role as any
      }
    });
  };

  const updateRoleField = (newValue: string) => {
    const currentRole = userPreferences?.role;

    // Handle giving a user admin role (admin -> non-admin)
    if (newValue === AdminMatchRole.admin && currentRole !== AdminMatchRole.admin) {
      setDialogConfig({
        title: "Grant Admin Privileges?",
        message: "Are you sure you want to grant admin privileges? This user will gain full access to system settings."
      });
      setPendingRole(newValue);
      setOpenAdminDialog(true);
      return;
    }

    // Handle stripping admin role from user (non-admin -> admin)
    if (currentRole === AdminMatchRole.admin && newValue !== AdminMatchRole.admin) {
      setDialogConfig({
        title: "Remove Admin Privileges?",
        message: `Are you sure you want to remove admin access? This user will be restricted to regular user permissions.`
      });
      setPendingRole(newValue);
      setOpenAdminDialog(true);
      return;
    }
  };

  const handleConfirmAdmin = () => {
    if (pendingRole) {
      commitRoleChange(pendingRole);
    }
    setOpenAdminDialog(false);
    setPendingRole(null);
  };

  const handleCancelAdmin = () => {
    setOpenAdminDialog(false);
    setPendingRole(null);
  };

  return (
    <>
      {/* Role Confirmation Pop-up Dialog */}
      <Dialog open={openAdminDialog} onClose={handleCancelAdmin}>
        <DialogTitle>{dialogConfig.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogConfig.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelAdmin} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmAdmin} color="error" variant="contained" autoFocus>
            Confirm Change
          </Button>
        </DialogActions>
      </Dialog>
    
      {personalInformation !== undefined &&
      <FormGroupCols>
        <FormLabel>Personal Information</FormLabel>
        <FormGroupRows>
          <TextInputControl value={personalInformation.firstName} label="First Name" readonly={!showEdit} onInput={(value) => updateNameField("firstName", value)} />
          <TextInputControl value={personalInformation.middleName ?? ''} label="Middle Name" readonly={!showEdit} onInput={(value) => updateNameField("middleName", value)} />
          <TextInputControl value={personalInformation.lastName} label="Last Name" readonly={!showEdit} onInput={(value) => updateNameField("lastName", value)} />
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
        
        {/* Mentor-specific fields */}
        {(userPreferences.role === MatchRole.mentor || userPreferences.role === MatchRole.both) && (
          <>
            <FormLabel sx={{ mt: 2 }}>Professional Information</FormLabel>
            <FormGroupRows>
              <FormControl fullWidth sx={{ minWidth: 250 }} disabled={!showEdit}>
                <InputLabel>Credentials *</InputLabel>
                <Select
                  value={personalInformation.credentials || ''}
                  onChange={(e) => updateNameField("credentials", e.target.value)}
                  label="Credentials *"
                >
                  {CREDENTIALS.map((credential) => (
                    <MenuItem key={credential} value={credential}>{credential}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormGroupRows>
            <FormGroupRows>
              <TextInputControl 
                value={personalInformation.currentProfession || ''} 
                label="Current Profession *" 
                readonly={!showEdit} 
                onInput={(value) => updateNameField("currentProfession", value)} 
               
              />
            </FormGroupRows>
          </>
        )}

        {/* Mentee-specific fields */}
        {(userPreferences.role === MatchRole.mentee || userPreferences.role === MatchRole.both) && (
          <>
            <FormLabel sx={{ mt: 2 }}>Student Information</FormLabel>
            <FormGroupRows>
              <FormControl fullWidth sx={{ minWidth: 250 }} disabled={!showEdit}>
                <InputLabel>College Year *</InputLabel>
                <Select
                  value={personalInformation.collegeYear || ''}
                  onChange={(e) => updateNameField("collegeYear", e.target.value)}
                  label="College Year *"
                >
                  {COLLEGE_YEARS.map((year) => (
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </FormGroupRows>
            <FormGroupRows>
              <FormControl fullWidth sx={{ minWidth: 250 }} disabled={!showEdit}>
                <SelectDegreeProgram
                  value={personalInformation.degreeProgram || ''}
                  onChange={(value) => updateNameField("degreeProgram", value)}
                  disabled={!showEdit}
                />
              </FormControl>
            </FormGroupRows>
          </>
        )}
      </FormGroupCols>
    }</>
  );
}

export default UpdatePersonalInformation;

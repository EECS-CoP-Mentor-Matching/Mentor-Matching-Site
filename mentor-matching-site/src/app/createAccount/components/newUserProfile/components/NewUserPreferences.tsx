import { UserPreferences } from "../../../../../types/userProfile";
import { FormLabel } from "@mui/material";
import FormGroupCols from "../../../../common/forms/layout/FormGroupCols";

interface NewUserPreferencesProps {
  userPreferences: UserPreferences
  setUserPreferences: (value: UserPreferences) => void
}

function NewUserPreferences(props: NewUserPreferencesProps) {
  return (
    <FormGroupCols>
      <FormLabel>User Preferences</FormLabel>
    </FormGroupCols>
  );
}

export default NewUserPreferences;
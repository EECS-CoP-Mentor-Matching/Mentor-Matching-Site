import { Button } from "@mui/material";
import FormGroupCols from "../../../common/forms/layout/FormGroupCols";

function ManageSite() {
  return (
    <FormGroupCols>
      <Button>Manage Techincal Interests</Button>
      <Button>Manage Professional Interests</Button>
      <Button>Manage Interest Experience Levels</Button>
      <Button>Manage Racial Identity Options</Button>
      <Button>Manage Time Zone Options</Button>
    </FormGroupCols>
  );
}

export default ManageSite;
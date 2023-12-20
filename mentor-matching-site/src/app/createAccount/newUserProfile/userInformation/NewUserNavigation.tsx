import FormGroupRows from "../../../common/FormGroupRows";
import { Button } from "@mui/material";

interface NewUserNavigationProps {
  nextStep: () => void
  hideNext?: boolean
  previousStep: () => void
  hidePrevious?: boolean
}

function NewUserNavigation(props: NewUserNavigationProps) {
  return (
    <FormGroupRows>
      {!props.hidePrevious && <Button onClick={props.previousStep}>Previous</Button>}
      {!props.hideNext && <Button onClick={props.nextStep}>Next</Button>}
    </FormGroupRows>
  );
}

export default NewUserNavigation;
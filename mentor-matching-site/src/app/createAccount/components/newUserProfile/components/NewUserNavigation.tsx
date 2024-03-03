import FormGroupRows from "../../../../common/forms/layout/FormGroupRows";
import { Button } from "@mui/material";

interface NewUserNavigationProps {
  nextStep: () => void
  hideNext?: boolean
  previousStep: () => void
  hidePrevious?: boolean
}

function NewUserNavigation({ nextStep, hideNext, previousStep, hidePrevious }: NewUserNavigationProps) {
  return (
    <FormGroupRows>
      {!hidePrevious && <Button onClick={previousStep}>Previous</Button>}
      {!hideNext && <Button onClick={nextStep}>Next</Button>}
    </FormGroupRows>
  );
}

export default NewUserNavigation;
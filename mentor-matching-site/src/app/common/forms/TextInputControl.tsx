import { Input, FormControl, InputLabel, StepLabel } from "@mui/material";
import { useState } from "react";

interface TextInputControlProps {
  onInput?: (data: string) => void
  onInputValidation?: (value: string) => boolean
  onSubmit?: () => void
  onSubmitValidation?: (value: string) => boolean
  label: string
  value?: string
  readonly?: boolean

}

function TextInputControl(props: TextInputControlProps) {
  const [isValid, setIsValid] = useState(true);
  const [value, setValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (props.onSubmit !== undefined) {
        if (props.onSubmitValidation !== undefined && value !== undefined) {
          if (props.onSubmitValidation(value)) {
            props.onSubmit();
          }
          else {
            setIsValid(false);
          }
        }
        else {
          props.onSubmit();
        }
      }
    }
  }

  return (
    <FormControl className="form-control">
      <InputLabel>{props.label}</InputLabel>
      <Input value={props.value}
        readOnly={props.readonly}
        onChange={(e) => {
          setValue(e.target.value);
          if (props.onInput !== undefined) {
            props.onInput(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown} />
      {!isValid &&
        <div style={{ color: 'red' }}>Invalid Input</div>
      }
    </FormControl>
  );
}

export default TextInputControl;
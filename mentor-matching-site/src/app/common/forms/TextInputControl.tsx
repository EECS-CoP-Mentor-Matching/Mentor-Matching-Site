import { Input, FormControl, InputLabel, StepLabel } from "@mui/material";
import React, { useState } from "react";

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
        if (checkModelState(props.onSubmitValidation, value)) {
          props.onSubmit();
        }
        else {
          setIsValid(false);
        }
      }
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
    if (props.onInput !== undefined) {
      if (checkModelState(props.onInputValidation, value)) {
        props.onInput(e.target.value);
      }
      else {
        setIsValid(false);
      }
    }
  }

  function checkModelState(validation?: (value: string) => boolean, value?: string) {
    if (validation !== undefined) {
      return value !== undefined && validation(value);
    }
    return true;
  }

  return (
    <FormControl className="form-control">
      <InputLabel>{props.label}</InputLabel>
      <Input value={props.value}
        readOnly={props.readonly}
        onChange={handleInput}
        onKeyDown={handleKeyDown} />
      {!isValid &&
        <div style={{ color: 'red' }}>Invalid Input</div>
      }
    </FormControl>
  );
}

export default TextInputControl;
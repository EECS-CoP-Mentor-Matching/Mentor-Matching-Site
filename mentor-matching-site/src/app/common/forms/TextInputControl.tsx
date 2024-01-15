import { Input, FormControl, InputLabel, StepLabel } from "@mui/material";
import React, { useState } from "react";
import SensitiveTextInputControl from "./SensitiveTextInputControl";

interface TextInputControlProps {
  onInput?: (data: string) => void
  onInputValidation?: (value: string) => boolean
  onSubmit?: () => void
  onSubmitValidation?: (value: string) => boolean
  label: string
  value?: string
  readonly?: boolean
  widthMulti?: number
  sensitive?: boolean
}

function TextInputControl({ onInput, onInputValidation, onSubmit, onSubmitValidation, label, value, readonly, widthMulti, sensitive }: TextInputControlProps) {
  const style = {
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`
  }

  const [isValid, setIsValid] = useState(true);
  const [currValue, setCurrValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      if (onSubmit !== undefined) {
        if (checkModelState(onSubmitValidation, currValue)) {
          onSubmit();
        }
        else {
          setIsValid(false);
        }
      }
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    handleInputValue(e.target.value);
  }

  function handleInputValue(value: string) {
    setCurrValue(value);
    if (onInput !== undefined) {
      if (checkModelState(onInputValidation, value)) {
        onInput(value);
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
      {sensitive &&
        <SensitiveTextInputControl onInput={handleInputValue} label={label} style={style} />
      }
      {!sensitive && <>
        <InputLabel>{label}</InputLabel>
        <Input value={value}
          readOnly={readonly}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          sx={style} />
      </>}
      {!isValid &&
        <div style={{ color: 'red' }}>Invalid Input</div>
      }
    </FormControl>
  );
}

export default TextInputControl;
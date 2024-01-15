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
  widthMulti?: number
  sensitive?: boolean
}

function TextInputControl({ onInput, onInputValidation, onSubmit, onSubmitValidation, label, value, readonly, widthMulti, sensitive }: TextInputControlProps) {
  const style = {
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`,
    color: sensitive ? "transparent" : ""
  }

  const [isValid, setIsValid] = useState(true);
  const [currValue, setCurrValue] = useState("");
  const [maskedValue, setMaskedValue] = useState('');

  function updateMasked(value: string) {
    let masked = '';
    for (let i = 0; i < value.length; i++) {
      masked += '•';
    }
    setMaskedValue(masked);
    if (onInput !== undefined) {
      onInput(value);
    }
  }

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
    if (sensitive) {
      updateMasked(e.target.value);
    }
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
      <InputLabel>{label}</InputLabel>
      <Input value={value}
        readOnly={readonly}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        sx={{ ...style }} />
      {sensitive &&
        <div style={{ zIndex: 100, position: 'absolute', bottom: 5, backgroundColor: 'white', fontSize: '1.5rem' }}>{maskedValue}</div>
      }
      {!isValid &&
        <div style={{ color: 'red' }}>Invalid Input</div>
      }
    </FormControl>
  );
}

export default TextInputControl;
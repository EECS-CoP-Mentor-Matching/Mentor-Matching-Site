import { TextField } from "@mui/material";
import React, { useState } from "react";

interface TextInputControlProps {
  onInput?: (data: string) => void
  onInputValidation?: (value: string) => boolean
  onSubmit?: () => void
  onSubmitValidation?: (value: string) => boolean
  label?: string
  value?: any
  readonly?: boolean
  widthMulti?: number
  sensitive?: boolean
  editColor?: string
  style?: any
}

function TextInputControl({ onInput, onInputValidation, onSubmit, onSubmitValidation, label, value, readonly, sensitive, editColor, style }: TextInputControlProps) {
  const [isValid, setIsValid] = useState(true);
  const [internalValue, setInternalValue] = useState('');

  // Use external value if provided (controlled), otherwise use internal state (uncontrolled)
  const isControlled = value !== undefined;
  const displayValue = isControlled ? (value ?? '') : internalValue;

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && onSubmit !== undefined) {
      if (checkModelState(onSubmitValidation, displayValue)) {
        onSubmit();
      } else {
        setIsValid(false);
      }
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    if (!isControlled) {
      setInternalValue(val);
    }
    if (onInput !== undefined) {
      if (checkModelState(onInputValidation, val)) {
        onInput(val);
      } else {
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
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <TextField
        fullWidth
        variant="outlined"
        label={label}
        type={sensitive ? 'password' : 'text'}
        value={displayValue}
        disabled={readonly}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        error={!isValid}
        helperText={!isValid ? "Invalid Input" : ""}
        sx={{
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: editColor ?? '#D73F09',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: editColor ?? '#D73F09',
          },
          ...style
        }}
      />
    </div>
  );
}

export default TextInputControl;

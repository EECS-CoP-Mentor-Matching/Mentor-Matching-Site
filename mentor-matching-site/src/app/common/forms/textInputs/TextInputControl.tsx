import { Input, FormControl, Box } from "@mui/material";
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

function TextInputControl({ onInput, onInputValidation, onSubmit, onSubmitValidation, label, value, readonly, widthMulti, sensitive, editColor, style }: TextInputControlProps) {
  const controlStyle = {
    width: '100%',
    maxWidth: `${widthMulti === undefined ? 10 : widthMulti * 100}rem`,
    borderBottomColor: editColor !== undefined ? editColor : ""
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
    <FormControl className="form-control" sx={{ mb: 2, width: "100%" }}>
      {label && (
        <Box component="label" sx={{ 
          display: 'block',
          mb: 1,
          fontWeight: 600,
          fontSize: '0.875rem',
          color: '#333'
        }}>
          {label}
        </Box>
      )}
      <Input 
        value={value}
        readOnly={readonly}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        type={sensitive ? 'password' : 'text'}
        disableUnderline
        sx={{ 
          ...controlStyle, 
          ...style,
          bgcolor: '#fff',
          borderRadius: '4px',
          padding: '12px 16px',
          fontSize: '1rem',
          border: '1px solid #ddd',
          '&:focus': {
            bgcolor: '#fff',
            borderColor: '#D73F09'
          }
        }} 
      />
      {!isValid &&
        <div style={{ color: 'red' }}>Invalid Input</div>
      }
    </FormControl>
  );
}

export default TextInputControl;

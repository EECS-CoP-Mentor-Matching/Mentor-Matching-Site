import { Input, FormControl, InputLabel } from "@mui/material";
import TextInputControl from "./TextInputControl";
import { useState } from "react";

interface SensitiveTextInputControlProps {
  onInput?: (data: string) => void
  label: string
  value?: string
  readonly?: boolean
  style: object
}

function SensitiveTextInputControl({ onInput, label, value, readonly, style }: SensitiveTextInputControlProps) {
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

  return (
    <FormControl className="form-control">
      <InputLabel>{label}</InputLabel>
      <Input value={value}
        onChange={(e) => { updateMasked(e.target.value) }}
        style={{ color: "transparent" }}
        sx={style} />
      <div style={{ zIndex: 100, position: 'absolute', bottom: 5 }}>{maskedValue}</div>
    </FormControl>
  );
}

export default SensitiveTextInputControl;
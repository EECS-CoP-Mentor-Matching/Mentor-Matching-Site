import { Input, FormControl, InputLabel } from "@mui/material";
import TextInputControl from "./TextInputControl";
import { useState } from "react";

interface SensitiveTextInputControlProps {
  onInput?: (data: string) => void
  label: string
  value?: string
  readonly?: boolean
}

function SensitiveTextInputControl(props: SensitiveTextInputControlProps) {
  const [maskedValue, setMaskedValue] = useState('');

  function updateMasked(value: string) {
    let masked = '';
    for (let i=0; i<value.length; i++) {
      masked += '•';
    }
    setMaskedValue(masked);
    if (props.onInput !== undefined) {
      props.onInput(value);
    }
  }

  return (
    <FormControl className="form-control">
      <InputLabel>{props.label}</InputLabel>
      <Input value={props.value} 
        onChange={(e) => {updateMasked(e.target.value)}} 
        style={{color: "transparent"}} />
      <div style={{zIndex: 100, position: 'absolute', bottom: 5}}>{maskedValue}</div>
    </FormControl>
  );
}

export default SensitiveTextInputControl;
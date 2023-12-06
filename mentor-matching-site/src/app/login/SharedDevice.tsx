import { InputLabel, Input } from "@mui/material";

function SharedDevice() {
  return (
    <div>
      <InputLabel>Is this device shared?</InputLabel>
      <Input type="checkbox"/>
    </div>
  );
}

export default SharedDevice;
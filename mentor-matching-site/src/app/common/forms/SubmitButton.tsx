
import { Button } from "@mui/material";

interface SubmitButtonProps {
  onSubmit?: () => void
  text: string
  widthMulti?: number
}

function SubmitButton({ onSubmit, text, widthMulti }: SubmitButtonProps) {
  const style = {
    paddingLeft: '1.00rem',
    paddingRight: '1.00rem',
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`
  }

  return (
    <Button onSubmit={onSubmit} sx={style}>{text}</Button>
  );
}

export default SubmitButton;

import { Button } from "@mui/material";

interface SubmitButtonProps {
  onClick?: () => void
  text: string
  widthMulti?: number
  disabled?: boolean
}

function SubmitButton({ onClick, text, disabled = false, widthMulti }: SubmitButtonProps) {
  const style = {
    paddingLeft: '1.00rem',
    paddingRight: '1.00rem',
    width: `${widthMulti == undefined ? 10 : widthMulti * 100}rem`
  }

  return (
    <Button
      onClick={() => {
      if (onClick !== undefined && !disabled) {
        onClick();
      }
    }} sx={style}>{text}</Button>
  );
}

export default SubmitButton;
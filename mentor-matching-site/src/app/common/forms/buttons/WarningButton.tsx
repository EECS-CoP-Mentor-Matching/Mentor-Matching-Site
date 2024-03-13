
import { Button } from "@mui/material";

interface WarningButtonProps {
  onClick?: () => void
  text: string
  widthMulti?: number
}

function WarningButton({ onClick, text, widthMulti }: WarningButtonProps) {
  const style = {
    paddingLeft: '1.00rem',
    paddingRight: '1.00rem',
    width: `${widthMulti === undefined ? 10 : widthMulti * 100}rem`,
    backgroundColor: 'darkred'

  }

  return (
    <Button onClick={() => {
      if (onClick !== undefined) {
        onClick();
      }
    }} sx={{ ...style }}>{text}</Button>
  );
}

export default WarningButton;
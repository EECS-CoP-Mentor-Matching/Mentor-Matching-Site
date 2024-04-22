
import { Button } from "@mui/material";
import { ReactElement } from "react";

interface WarningButtonProps {
  onClick?: () => void
  text?: string
  widthMulti?: number
  children?: ReactElement[] | ReactElement | any
}

function WarningButton({ onClick, text, widthMulti, children }: WarningButtonProps) {
  const style = {
    width: `${widthMulti === undefined ? 10 : widthMulti * 100}rem`,
    backgroundColor: 'darkred',
    fontSize: '10px',
  }

  return (
    <Button onClick={() => {
      if (onClick !== undefined) {
        onClick();
      }
    }} sx={{ ...style }}>{text}{children}</Button>
  );
}

export default WarningButton;
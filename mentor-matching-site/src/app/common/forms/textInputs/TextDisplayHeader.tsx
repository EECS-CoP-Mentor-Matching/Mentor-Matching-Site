import TextDisplay from "./TextDisplay";
import { ReactElement } from "react";

interface TextDisplayHeaderProps {
  children?: ReactElement[] | ReactElement | any | undefined
  headerType?: string
}

function TextDisplayHeader({ children, headerType }: TextDisplayHeaderProps) {
  const header = () => {
    switch (headerType) {
      case 'h1':
        return <h1>{children}</h1>
      case 'h2':
        return <h2>{children}</h2>
      case 'h3':
        return <h3>{children}</h3>
      case 'h4':
        return <h4>{children}</h4>
      default:
        return <h1>{children}</h1>
    }
  }
  return (
    <>{header()}</>
  );
}

export default TextDisplayHeader;
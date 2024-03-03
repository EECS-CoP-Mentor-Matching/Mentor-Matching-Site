import { ReactElement } from "react";

interface FormHeaderProps {
  children?: ReactElement[] | ReactElement | any
  style?: any
}

function FormHeader({ children, style }: FormHeaderProps) {
  return (
    <h2 style={{ fontWeight: 'normal', marginBottom: '0px', color: 'rgba(100,100,100,1)', ...style }}>
      {children}
    </h2>
  )
}

export default FormHeader;
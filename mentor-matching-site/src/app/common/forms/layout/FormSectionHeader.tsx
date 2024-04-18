import { ReactElement } from "react";

interface FormSectionHeaderProps {
  children?: ReactElement[] | ReactElement | any
  style?: any
}

function FormSectionHeader({ children, style }: FormSectionHeaderProps) {
  return (
    <h3 style={{ fontWeight: 'normal', marginBottom: '0px', borderBottom: '1px solid black', color: 'rgba(100,100,100,1)', ...style }}>
      {children}
    </h3>
  )
}

export default FormSectionHeader;
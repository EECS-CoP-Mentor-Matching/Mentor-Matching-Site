import { ReactElement } from "react";

interface TextDisplaySectionProps {
  children?: ReactElement[] | ReactElement | any
}

function TextDisplaySection({ children }: TextDisplaySectionProps) {
  return (
    <section>
      {children}
    </section>
  );
}

export default TextDisplaySection;
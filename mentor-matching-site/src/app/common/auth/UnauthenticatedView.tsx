import { ReactElement, useEffect, useState } from "react";
import authService from "../../../service/authService";

interface UnauthenticatedViewProps {
  children?: ReactElement[] | ReactElement | any
}

function UnauthenticatedView({ children }: UnauthenticatedViewProps) {
  const [notAuth, setNotAuth] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      setNotAuth(user === null);
    }
    checkAuthState();
  }, [notAuth, setNotAuth]);

  return (
    <>
      {notAuth && children}
    </>
  );
}

export default UnauthenticatedView;
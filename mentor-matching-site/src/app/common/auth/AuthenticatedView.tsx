import { ReactElement, useEffect, useState } from "react";
import authService from "../../../service/authService";

interface AuthenticatedViewProps {
  children?: ReactElement[] | ReactElement | any
}

function AuthenticatedView({ children }: AuthenticatedViewProps) {
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      setShowAuth(user !== null);
    }
    checkAuthState();
  }, [showAuth, setShowAuth]);

  return (
    <>
      {showAuth && children}
    </>
  );
}

export default AuthenticatedView;
import { ReactElement, useEffect, useState } from "react";
import authService from "../../../service/authService";
import { useNavigate } from "react-router-dom";

interface UnauthenticatedViewProps {
  onloadNavigate?: boolean
  navigateToRoute?: string
  children?: ReactElement[] | ReactElement | any
}

function UnauthenticatedView({ onloadNavigate, navigateToRoute, children }: UnauthenticatedViewProps) {
  const [notAuth, setNotAuth] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      const unauthed = user === null;
      if (unauthed && onloadNavigate && navigateToRoute !== null) {
        navigate(navigateToRoute as string);
      }
      setNotAuth(unauthed);
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
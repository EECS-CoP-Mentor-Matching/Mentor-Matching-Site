import { ReactElement, useEffect, useState } from "react";
import authService from "../../../service/authService";
import {UserProfile} from "../../../types/userProfile";
import userService from "../../../service/userService";
import {MatchRole} from "../../../types/matchProfile";

interface AuthenticatedViewProps {
  children?: ReactElement[] | ReactElement | any
  mentor?: ReactElement[] | ReactElement | any
  mentee?: ReactElement[] | ReactElement | any
}

function AuthenticatedView({ children, mentor, mentee }: AuthenticatedViewProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [showMentee, setShowMentee] = useState(false);
  const [showMentor, setShowMentor] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      if (user) {
        const userProfile: UserProfile = await userService.getUserProfile(user.uid);
        const role = userProfile.preferences?.role || MatchRole.both;
        if (role == MatchRole.mentee || role == MatchRole.both) {
          setShowMentee(true);
        }
        if (role == MatchRole.mentor || role == MatchRole.both) {
          setShowMentor(true);
        }
        setShowAuth(true);
      } else {
        setShowAuth(false);
      }
    }
    checkAuthState();
  }, [showAuth, setShowAuth]);

  return (
    <>
      {showMentee && mentee}
      {showMentor && mentor}
      {showAuth && children}
    </>
  );
}

export default AuthenticatedView;
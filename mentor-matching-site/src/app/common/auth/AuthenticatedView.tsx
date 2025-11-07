import { ReactElement, useEffect, useState } from "react";
import authService from "../../../service/authService";
import {UserProfile} from "../../../types/userProfile";
import userService from "../../../service/userService";
import {MatchRole} from "../../../types/matchProfile";
import {useNavigate} from "react-router-dom";

interface AuthenticatedViewProps {
  children?: ReactElement[] | ReactElement | any
  mentor?: ReactElement[] | ReactElement | any
  mentee?: ReactElement[] | ReactElement | any
  admin?: ReactElement[] | ReactElement | any
}

function AuthenticatedView({ children, mentor, mentee, admin }: AuthenticatedViewProps) {
  const [showAuth, setShowAuth] = useState(false);
  const [showMentee, setShowMentee] = useState(false);
  const [showMentor, setShowMentor] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      if (user) {
        if (user.emailVerified) {
          let userProfile: UserProfile;
          try {
            userProfile = await userService.getUserProfile(user.uid);
          } catch (error) {
            // reload recently verified email token
            await authService.refreshToken()
            userProfile = await userService.getUserProfile(user.uid);
          }
          if (userProfile.UID === user.uid) {
            const role = userProfile.preferences?.role || MatchRole.both;
            if (role == MatchRole.mentee || role == MatchRole.both) {
              setShowMentee(true);
            }
            if (role == MatchRole.mentor || role == MatchRole.both) {
              setShowMentor(true);
            }
            if (role == MatchRole.admin || role == MatchRole.both){
              setShowMentor(true);
            }
            setShowAuth(true);
          } else {
            setShowAuth(false);
            navigate("/new-profile")
          }
        } else {
          setShowAuth(false);
          navigate("/new-profile")
        }
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
      {showAdmin && admin}
      {showAuth && children}
    </>
  );
}

export default AuthenticatedView;
import "./TopNav.css";
import { hamburger } from "../../icons/icons";
import { Button } from "@mui/material";
import authService from "../../service/authService";
import { useNavigate } from "react-router-dom";
import { osuIcon } from "../../icons/icons";
import { useAppDispatch, useAppSelector } from "../../redux/hooks"; 
import { updateProfile } from "../../redux/reducers/userProfileReducer"; 
import { initUserProfile } from "../../types/userProfile"; 

function TopNav() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // 1. Get the user information
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
 

  // 2. Determine status: If there's an userid, you are logged in.
  const isLoggedIn = !!(userProfile?.UID); 


  function openSideNav() {
    var sideNav = document.getElementById("sideNav");
    if (sideNav != null) {
      sideNav.style.width = "250px";
    }
  }

  async function logout() {
    try {
      await authService.signOut();
      // 3. Clear Redux - Forces immediate UI refresh
      dispatch(updateProfile(initUserProfile())); 
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="top-nav">
      <Button onClick={openSideNav}>{hamburger}</Button>

      <div className="logo">
        <a href="https://oregonstate.edu/" style={{ paddingTop: '2rem' }}>{osuIcon}</a>
      </div>

      <div className="log-button">
        {isLoggedIn ? (
          /* Show Logout if Redux has an email */
          <Button style={{ marginRight: '10px' }} onClick={logout}>
            Logout
          </Button>
        ) : (
          /* Show Login if Redux is empty - No wrapper to block it */
          <Button style={{ marginRight: '10px' }} onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

export default TopNav;
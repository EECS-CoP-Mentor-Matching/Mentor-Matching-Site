import "./TopNav.css";
import { hamburger } from "../../icons/icons";
import { Button } from "@mui/material";
import authService from "../../service/authService";
import UnauthenticatedView from "../common/auth/UnauthenticatedView";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { osuIcon } from "../../icons/icons";

function TopNav() {
    const [showAuth, setShowAuth] = useState(false);

  async function logout() {
    await authService.signOut();
  }

  function openSideNav() {
    var sideNav = document.getElementById("sideNav");
    if (sideNav != null) {
      sideNav.style.width = "250px";
    }
  }

    useEffect(() => {
        const checkAuthState = async () => {
            const user = await authService.getSignedInUser();
            if (user) {
                setShowAuth(true);
            }
        }
        checkAuthState();
    }, [showAuth, setShowAuth]);

  // if not logged in, show login button
return (
  <div className="top-nav">
    {/* 1. Hamburger Menu (Far Left) */}
    <Button onClick={openSideNav}>{hamburger}</Button>

    {/* 2. Logo (Center) */}
    <div className="logo">
      <a href="https://oregonstate.edu/" style={{ paddingTop: '2rem' }}>{osuIcon}</a>
    </div>

    {/* 3. Auth Actions (Far Right) */}
    {/* Move the Logout button here so it shares the same position as Login */}
    {showAuth ? (
      <div className="log-button">
        <Button style={{ marginRight: '10px' }} href="/login" onClick={logout}>
          Logout
        </Button>
      </div>
    ) : (
      <UnauthenticatedView>
        <div className="log-button">
          <Button style={{ marginRight: '10px' }} href="/login">
            Login
          </Button>
        </div>
      </UnauthenticatedView>
    )}
  </div>
);
}

export default TopNav;
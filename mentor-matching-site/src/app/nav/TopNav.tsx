import "./TopNav.css";
import { hamburger } from "../../icons/icons";
import { Button } from "@mui/material";
import { useEffect, useState } from "react";
import authService from "../../service/authService";

interface TopNavProps {
  signedIn: boolean
}

function TopNav(props: TopNavProps) {
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      await authService.waitForAuthState()
      setShowLogin(true);
    }
    checkAuthState();
  });

  async function logout() {
    await authService.signOut();
  }

  function openSideNav() {
    var sideNav = document.getElementById("sideNav");
    if (sideNav != null) {
      sideNav.style.width = "250px";
    }
  }

  // if not logged in, show login button
  return (
    <div className="top-nav">
      <Button onClick={openSideNav}>{hamburger}</Button>
      {showLogin && 
        <>
          {props.signedIn &&
          <Button href="/logout" onClick={logout}>Logout</Button>
          }
          {!props.signedIn && 
          <div>
            <Button style={{ marginRight: '10px' }} href="/login">Login</Button>
            <Button  href="/create-account">Create Account</Button>
          </div>
          }
        </>
      }
    </div>
  )
}

export default TopNav;
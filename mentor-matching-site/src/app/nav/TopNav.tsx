import "./TopNav.css";
import { hamburger } from "../../icons/icons";
import { Button } from "@mui/material";
import authService from "../../service/authService";
import AuthenticatedView from "../common/auth/AuthenticatedView";
import UnauthenticatedView from "../common/auth/UnauthenticatedView";

function TopNav() {
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
      <AuthenticatedView>
        <Button href="/login" onClick={logout}>Logout</Button>
      </AuthenticatedView>
      <UnauthenticatedView>
        <div>
          <Button style={{ marginRight: '10px' }} href="/login">Login</Button>
          <Button href="/create-account">Create Account</Button>
        </div>
      </UnauthenticatedView>

    </div>
  )
}

export default TopNav;
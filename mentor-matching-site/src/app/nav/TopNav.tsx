import "./TopNav.css";
import { hamburger } from "../../icons/icons";
import { Button } from "@mui/material";

function TopNav() {
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
      <Button href="/login">Login</Button>
    </div>
  )
}

export default TopNav;
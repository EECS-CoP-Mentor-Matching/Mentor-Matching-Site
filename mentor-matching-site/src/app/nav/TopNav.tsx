import "./TopNav.css";
import { hamburger } from "../../icons/icons";

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
      <button className="open-side-nav" onClick={openSideNav}>{hamburger}</button>
      <a href="/login">Login</a>
    </div>
  )
}

export default TopNav;
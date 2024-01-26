import { osuIcon } from "../../icons/icons";
import FormGroupRows from "../common/forms/layout/FormGroupRows";
import "./SideNav.css";

interface SideNavProps {
  signedIn: boolean
}

function SideNav(props: SideNavProps) {
  function closeNav() {
    var sideNav = document.getElementById("sideNav");
    if (sideNav != null) {
      sideNav.style.width = "0";
    }
  }

  return (
    <div className="side-nav" id="sideNav">
      <button className="closebtn" onClick={closeNav}>&times;</button>
      <div className="side-nav-items">
        <a href="/" style={{ paddingTop: '2rem' }}>{osuIcon}</a>
        {props.signedIn && <>
          <a href="/mentee-portal">Mentee Portal</a>
          <a href="/mentor-portal">Mentor Portal</a>
          <a href="/admin-portal">Admin Portal</a>
          <a href="/update-profile">Profile</a>
        </>}
        <a href="/">Home</a>
      </div>
    </div>
  )
}

export default SideNav;
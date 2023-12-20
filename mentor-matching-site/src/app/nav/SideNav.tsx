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
      { props.signedIn && <>
          <a href="/mentee-portal">Mentee Portal</a>
          <a href="/mentor-portal">Mentor Portal</a>
          <a href="/admin-portal">Admin Portal</a>
          <a href="/profile">Profile</a>
      </>}
      <a href="/">Home</a>
    </div>
  )
}

export default SideNav;
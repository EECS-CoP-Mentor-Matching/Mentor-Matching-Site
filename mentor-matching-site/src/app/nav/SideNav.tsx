import "./SideNav.css";

function SideNav() {
  function closeNav() {
    var sideNav = document.getElementById("sideNav");
    if (sideNav != null) {
      sideNav.style.width = "0";
    }
    console.log(sideNav);
  }

  return (
    <div className="side-nav" id="sideNav">
      <button className="closebtn" onClick={closeNav}>&times;</button>
      <a href="/mentee-portal">Mentee Portal</a>
      <a href="/mentor-portal">Mentor Portal</a>
      {/* only show when logged in */}
      <a href="/profile">Profile</a>
    </div>
  )
}

export default SideNav;
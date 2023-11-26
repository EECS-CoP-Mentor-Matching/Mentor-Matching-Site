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
      <a className="closebtn" onClick={closeNav}>&times;</a>
      <a>Mentee Portal</a>
      <a>Mentor Portal</a>
      <a>Profile</a>
    </div>
  )
}

export default SideNav;
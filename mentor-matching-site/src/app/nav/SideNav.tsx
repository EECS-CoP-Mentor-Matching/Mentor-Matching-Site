import { useAppSelector } from "../../redux/hooks"; // USE THIS
import authService from "../../service/authService";
import userService from "../../service/userService";
import { UserProfile } from "../../types/userProfile";
import { MatchRole } from "../../types/matchProfile";
import { osuIcon } from "../../icons/icons";
import "./SideNav.css";

function SideNav() {
  // 1. REMOVED: useState and useEffect
  // 2. ADDED: This selector listens to the Redux store you updated in Login.tsx
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
  const userRole = userProfile.preferences?.role;

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
        <a href="https://oregonstate.edu/" style={{ paddingTop: '2rem' }}>{osuIcon}</a>
        
        {/* === CONDITIONAL PORTAL LINKS === */}
        
        {/* ADMIN Portal Link: Shows ONLY if role is Admin */}
        {userRole === MatchRole.admin && (
          <a href="/admin-portal">Admin Portal</a>
        )}

        {/* MENTEE Portal Link: Shows if role is Mentee or Both */}
        {(userRole === MatchRole.mentee || userRole === MatchRole.both) && (
          <a href="/mentee-portal">Mentee Portal</a>
        )}

        {/* MENTOR Portal Link: Shows if role is Mentor or Both */}
        {(userRole === MatchRole.mentor || userRole === MatchRole.both) && (
          <a href="/mentor-portal">Mentor Portal</a>
        )}
        
        {/* Universal Authenticated Links (Shows for any logged-in user) */}
        {(userRole === MatchRole.mentor || userRole === MatchRole.mentee) && (
          <a href="/update-profile">Update Profile</a>
        )}
        
        <a href="/">Home</a>
      </div>
    </div>
  )
}

export default SideNav;
import { useEffect, useState } from "react"; // NEW
import authService from "../../service/authService"; // NEW (Adjust path if needed)
import userService from "../../service/userService"; // NEW (Adjust path if needed)
import { UserProfile } from "../../types/userProfile"; // NEW (Adjust path if needed)
import { MatchRole } from "../../types/matchProfile"; // NEW (Assuming this has 'Admin')

import { osuIcon } from "../../icons/icons";
// REMOVE: import AuthenticatedView from "../common/auth/AuthenticatedView";
import "./SideNav.css";

function SideNav() {
  const [userRole, setUserRole] = useState<string | null>(null); // NEW

  function closeNav() {
    // ... existing closeNav logic ...
    var sideNav = document.getElementById("sideNav");
    if (sideNav != null) {
      sideNav.style.width = "0";
    }
  }

  useEffect(() => {
    const fetchUserRole = async () => {
      const user = await authService.getSignedInUser();
      if (user) {
        try {
          // Fetch the user profile and extract the nested role
          const userProfile: UserProfile = await userService.getUserProfile(user.uid);
          const role = userProfile.preferences?.role;
          setUserRole(role || null);
        } catch (error) {
          // Handle errors (e.g., user profile not yet created)
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    };
    fetchUserRole();
  }, []); // Empty dependency array ensures this runs only on mount

return (
    <div className="side-nav" id="sideNav">
      <button className="closebtn" onClick={closeNav}>&times;</button>
      <div className="side-nav-items">
        <a href="/" style={{ paddingTop: '2rem' }}>{osuIcon}</a>
        
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
        {userRole && (
          <a href="/update-profile">Update Profile</a>
        )}
        
        <a href="/">Home</a>
      </div>
    </div>
  )
}

export default SideNav;
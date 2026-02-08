import "./TopNav.css";
import { Button, IconButton, Avatar, Tooltip, Menu, Box, Typography, Divider } from "@mui/material";
import authService from "../../service/authService";
import { Link, useNavigate } from "react-router-dom";
import { osuIcon } from "../../icons/icons"; 
import { useAppDispatch, useAppSelector } from "../../redux/hooks"; 
import { updateProfile } from "../../redux/reducers/userProfileReducer"; 
import { initUserProfile } from "../../types/userProfile"; 
import { MatchRole } from "../../types/matchProfile";
import AccountCircle from '@mui/icons-material/AccountCircle';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import { useState } from 'react';

function TopNav() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State for managing the account menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => { setAnchorEl(event.currentTarget); };
  const handleClose = () => { setAnchorEl(null); };
  const goToUpdate = () => { handleClose(); navigate('/update-profile'); };

  const userProfile = useAppSelector((state) => state.userProfile.userProfile);
  const isLoggedIn = !!(userProfile?.UID); 
  const userRole = userProfile?.preferences?.role;

  const isAdmin = userRole === MatchRole.admin;
  const isMentor = userRole === MatchRole.mentor;
  const isMentee = userRole === MatchRole.mentee;

  async function logout() {
    try {
      await authService.signOut();
      dispatch(updateProfile(initUserProfile())); 
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const avatarStyle = { 
    bgcolor: "black", 
    width: 40, 
    height: 40, 
    border: '3px solid white' 
  };

  return (
    <nav className="top-nav">
      {/* LEFT: Logo */}
      <div className="logo">
        <a href="https://oregonstate.edu/" style={{ paddingTop: '2rem' }}>
          {osuIcon}
        </a>
      </div>

      {/* CENTER: Main Title */}
      <h1 className="main-title">EECS Mentor Match</h1>

      {/* RIGHT: User Actions Cluster */}
      <div className="user-action-container">
        <div className="icon-row">
          <Tooltip title="Go Home" arrow>
            <IconButton component={Link} to="/" sx={{ p: 0, mr: '10px' }}>
              <Avatar sx={avatarStyle}>
                <HomeIcon sx={{ color: "white", fontSize: 20 }} />
              </Avatar>
            </IconButton>
          </Tooltip>

          {isLoggedIn ? (
            <>
              <Tooltip title="Log Out" arrow>
                <IconButton sx={{ p: 0, mr: '10px' }} onClick={logout}>
                  <Avatar sx={avatarStyle}>
                    <LogoutIcon sx={{ color: "white", fontSize: 20 }} />
                  </Avatar>
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Account" arrow>
                <IconButton onClick={handleOpen} sx={{ p: 0 }}>
                  <Avatar src={userProfile?.imageUrl} alt="Profile" sx={avatarStyle}>
                    <AccountCircle sx={{ color: "white", fontSize: 30 }} />
                  </Avatar>
                </IconButton>
              </Tooltip>

              {/* PROFILE POPUP MENU */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  sx: {
                    width: 350,
                    maxHeight: '80vh',
                    padding: 2,
                    mt: 1.5,
                    bgcolor: '#f5f5f5', 
                    boxShadow: '0px 4px 15px rgba(0,0,0,0.15)',
                    borderRadius: '10px',
                    overflowY: 'auto'
                  }
                }}
              >
                {/* Header Section */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={userProfile?.imageUrl} 
                    sx={{ width: 70, height: 70, mb: 1, border: '3px solid white', boxShadow: 2 }} 
                  />
                  <Typography variant="h6" fontWeight="bold" sx={{ color: '#222' }}>
                    {userProfile?.personal?.firstName} {userProfile?.personal?.lastName}
                  </Typography>
                  <Typography variant="subtitle2" sx={{ color: '#d73f09', fontWeight: 'bold' }}>
                    {userProfile?.preferences?.role || "Mentee"}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="button" sx={{ fontWeight: 'bold', mb: 1, display: 'block', color: '#666' }}>
                  Account Details
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#d73f09', fontWeight: 'bold' }}>PERSONAL</Typography>
                    <Typography variant="body2"><strong>Full Name:</strong> {userProfile?.personal?.firstName} {userProfile?.personal?.middleName} {userProfile?.personal?.lastName}</Typography>
                    <Typography variant="body2"><strong>DOB:</strong> {userProfile?.personal?.dob?.month}/{userProfile?.personal?.dob?.day}/{userProfile?.personal?.dob?.year}</Typography>
                    <Typography variant="body2"><strong>Pronouns:</strong> {userProfile?.contact?.pronouns}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#d73f09', fontWeight: 'bold' }}>CONTACT</Typography>
                    <Typography variant="body2"><strong>Email:</strong> {userProfile?.contact?.email || "No email set"}</Typography>
                    <Typography variant="body2"><strong>Time Zone:</strong> {userProfile?.contact?.timeZone}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#d73f09', fontWeight: 'bold' }}>DEMOGRAPHICS</Typography>
                    <Typography variant="body2"><strong>LGBTQ+:</strong> {userProfile?.demographics?.lgbtqPlusCommunity ? "Yes" : "No"}</Typography>
                    <Typography variant="body2"><strong>Racial Identity:</strong> {userProfile?.demographics?.racialIdentity}</Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" sx={{ color: '#d73f09', fontWeight: 'bold' }}>EDUCATION</Typography>
                    <Typography variant="body2"><strong>Level:</strong> {userProfile?.education?.highestLevelOfEducation}</Typography>
                    <Typography variant="body2"><strong>Program:</strong> {userProfile?.education?.degreeProgram || "N/A"}</Typography>
                    <Typography variant="body2"><strong>Active Student:</strong> {userProfile?.education?.studentStatus ? "Yes" : "No"}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Footer Link Style */}
                <Box 
                  onClick={goToUpdate} 
                  sx={{ 
                    textAlign: 'center', 
                    pb: 1, 
                    cursor: 'pointer',
                    '&:hover .update-link-text': {
                      textDecoration: 'underline',
                      color: '#b33507'
                    }
                  }}
                >
                  <Typography 
                    className="update-link-text"
                    variant="body2" 
                    sx={{ color: '#D73F09', fontWeight: 'bold', fontSize: '0.9rem' }}
                  >
                    Update Account Information
                  </Typography>
                </Box>
              </Menu>
            </>
          ) : (
            <Button 
              variant="outlined" 
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          )}
        </div>

        {isLoggedIn && (
          <div className="user-info-stack">
            <h3 className="user-greeting">
              Hello {userProfile?.contact?.displayName || "User"}
            </h3>

            {userRole && (
              <Link 
                to={isAdmin ? "/admin-portal" : isMentor ? "/mentor-portal" : "/mentee-portal"} 
                className="portal-link"
              >
                Your {isAdmin ? "Admin" : isMentor ? "Mentor" : "Mentee"} Portal
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopNav;
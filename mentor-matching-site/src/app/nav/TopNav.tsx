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
  const isBoth = userRole === MatchRole.both;

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

  // ============================================
  // DYNAMIC PROFILE RENDERING
  // ============================================
  
  // Convert camelCase to Title Case with spaces
  const formatFieldName = (key: string): string => {
    return key
      .replace(/([A-Z])/g, ' $1') // Add space before capitals
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
      .trim();
  };

  // Format values for display
  const formatValue = (value: any): string => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return ''; // Skip nested objects (will be rendered separately)
    return String(value);
  };

  // Recursively render profile sections
  const renderProfileSection = (sectionKey: string, sectionData: any) => {
    // Skip these fields
    const skipFields = ['UID', 'matchHistory', 'profilePictureUrl', 'imageUrl', 'accountSettings', 'preferences'];
    if (skipFields.includes(sectionKey)) return null;
    
    // If it's not an object, skip (we only want nested sections)
    if (typeof sectionData !== 'object' || sectionData === null) return null;

    const fields: { key: string; value: any }[] = [];
    
    // Collect all non-object fields in this section
    Object.entries(sectionData).forEach(([key, value]) => {
      if (typeof value !== 'object' || value === null) {
        const formattedValue = formatValue(value);
        if (formattedValue) { // Only include if there's a value
          fields.push({ key, value: formattedValue });
        }
      }
    });

    // If no fields to show, skip this section
    if (fields.length === 0) return null;

    return (
      <Box key={sectionKey}>
        <Typography variant="caption" sx={{ color: '#d73f09', fontWeight: 'bold' }}>
          {formatFieldName(sectionKey).toUpperCase()}
        </Typography>
        {fields.map(({ key, value }) => (
          <Typography key={key} variant="body2">
            <strong>{formatFieldName(key)}:</strong> {value}
          </Typography>
        ))}
      </Box>
    );
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

              {/* PROFILE POPUP MENU - FULLY DYNAMIC */}
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

                {/* FULLY DYNAMIC RENDERING - Shows whatever fields exist */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {userProfile && Object.entries(userProfile).map(([key, value]) => 
                    renderProfileSection(key, value)
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Footer Link */}
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
            <>
              {/* Admin Portal */}
              {isAdmin && (
                <Link to="/admin-portal" className="portal-link">
                  Your Admin Portal
                </Link>
              )}

              {/* Mentee Portal - Shows if Mentee or Both */}
              {(isMentee || isBoth) && (
                <Link to="/mentee-portal" className="portal-link">
                  Your Mentee Portal
                </Link>
              )}

              {/* Mentor Portal - Shows if Mentor or Both */}
              {(isMentor || isBoth) && (
                <Link to="/mentor-portal" className="portal-link">
                  Your Mentor Portal
                </Link>
              )}
            </>
          )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default TopNav;

import React, { useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import CreateMentorProfile from "./components/CreateMentorProfile";
import PortalNavigationBar from "../common/navigation/PortalNavigationBar";
import { Box } from "@mui/material";
import ActiveProfiles from "./components/ActiveProfiles";
import MentorMatches from "./components/MentorMatches";
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import MentorMatchHistory from "./components/MentorMatchHistory";
import TopNav from "../nav/TopNav"; // Make sure to import
import SideNav from "../nav/SideNav"; // Make sure to import

function MentorPortal() {
  const navItems = ['Create Profile', 'Active Profiles', 'Matches', 'Match History'];
  const [selectedTab, setSelectedTab] = useState('Create Profile');
  const handleNavChange = (newValue: string) => {
    setSelectedTab(newValue);
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Create Profile':
        return <CreateMentorProfile />;
      case 'Active Profiles':
        return <ActiveProfiles />;
      case 'Matches':
        return <MentorMatches />;
      default:
        return <MentorMatchHistory />;
    }
    
  };
  const userProfile = useAppSelector((state) => state.userProfile.userProfile);

  return (
    <>
      <AuthenticatedView>
        <h3>Hello {userProfile?.contact?.displayName}</h3>
        <Box>
          <PortalNavigationBar navItems={navItems} selected={selectedTab} onNavChange={handleNavChange} />
          {renderTabContent()}
        </Box>
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default MentorPortal;
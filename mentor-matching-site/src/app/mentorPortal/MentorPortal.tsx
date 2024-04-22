import React, { useState } from 'react';
import CreateMentorProfile from "./components/CreateMentorProfile";
import PortalNavigationBar from "../common/navigation/PortalNavigationBar";
import { Box } from "@mui/material";
import ActiveProfiles from "./components/ActiveProfiles";
import MentorMatches from "./components/MentorMatches";
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';

function MentorPortal() {
  const navItems = ['Create Profile', 'Active Profiles', 'Matches'];
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
      default:
        return <MentorMatches />;
    }
  };

  return (
    <>
      <AuthenticatedView>
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
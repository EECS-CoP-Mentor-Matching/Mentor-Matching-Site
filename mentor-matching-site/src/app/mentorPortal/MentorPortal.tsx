import React, { useState } from 'react';
import CreateMentorProfile from "./components/CreateMentorProfile";
import PortalNavigationBar from "../common/navigation/PortalNavigationBar";
import { Box } from "@mui/material";
import ActiveProfiles from "./components/ActiveProfiles";
import MentorMatches from "./components/MentorMatches";
import MatchRequests from "./components/MatchRequests";
import MyMentees from "./components/MyMentees";
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';

function MentorPortal() {
  const navItems = ['Active Profiles', 'Create Profile', 'Pending Requests', 'My Mentees', 'Messages'];
  const [selectedTab, setSelectedTab] = useState('Active Profiles');

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Create Profile':
        return <CreateMentorProfile />;
      case 'Active Profiles':
        return <ActiveProfiles />;
      case 'Pending Requests':
        return <MatchRequests />;
      case 'My Mentees':
        return <MyMentees />;
      case 'Messages':
        return <MentorMatches />;
      default:
        return <ActiveProfiles />;
    }
  };

  return (
    <>
      <AuthenticatedView>
        <Box>
          <PortalNavigationBar navItems={navItems} selected={selectedTab} onNavChange={setSelectedTab} />
          {renderTabContent()}
        </Box>
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default MentorPortal;

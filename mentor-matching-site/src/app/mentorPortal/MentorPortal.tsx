import React, { useState } from 'react';
import CreateProfile from "./components/CreateProfile";
import PortalNavigationBar from "../common/navigation/PortalNavigationBar";
import { Box } from "@mui/material";
import ActiveProfiles from "./components/ActiveProfiles";

function MentorPortal() {
    const navItems = ['Create Profile', 'Active Profiles'];
    const [selectedTab, setSelectedTab] = useState('Create Profile');
    const handleNavChange = (newValue: string) => {
        setSelectedTab(newValue);
    };

    const renderTabContent = () => {
        switch (selectedTab) {
            case 'Active Profiles':
                return <ActiveProfiles />;
            default:
                return <CreateProfile />;
        }
    };

    return (
        <Box>
            <PortalNavigationBar navItems={navItems} selected={selectedTab} onNavChange={handleNavChange} />
            {renderTabContent()}
        </Box>
    );
}

export default MentorPortal;
import * as React from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';
import PortalNavigationTabs from './PortalNavigationTabs';

const boxStyle = {
  width: '100%',
  paddingLeft: {
    xs: '0%',
    sm: '10%',
    md: '10%',
    lg: '15%',
    xl: '30%'
  },
  marginBottom: '2px',
  overflowX: 'auto'
}

type PortalNavigationBarProps = {
  navItems?: string[];
  selected?: string;
  onNavChange?: (newValue: string) => void;
};

const PortalNavigationBar = ({ navItems, selected, onNavChange }: PortalNavigationBarProps) => {
  const handleNavChange = (event: React.SyntheticEvent, newValue: string) => { // Add type for newValue
    if (onNavChange) {
      onNavChange(newValue);
    }
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#DC4405', boxShadow: 'none' }}>
      <Box sx={boxStyle}>
        <PortalNavigationTabs handleNavChange={handleNavChange} navItems={navItems} selected={selected} />
      </Box>
    </AppBar>
  );
}

export default PortalNavigationBar;

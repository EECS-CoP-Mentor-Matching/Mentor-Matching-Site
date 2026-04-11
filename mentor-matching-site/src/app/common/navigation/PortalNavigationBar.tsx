import * as React from 'react';
import { AppBar, Box } from '@mui/material';
import PortalNavigationTabs from './PortalNavigationTabs';

const boxStyle = {
  display: 'flex',
  justifyContent: 'center',
  border: 'none',
  marginBottom: '2px',
  overflowX: 'auto',   // allows the tab bar itself to scroll if needed
  width: '100%',
};

type PortalNavigationBarProps = {
  navItems?: string[];
  selected?: string;
  onNavChange?: (newValue: string) => void;
};

const PortalNavigationBar = ({ navItems, selected, onNavChange }: PortalNavigationBarProps) => {
  const handleNavChange = (event: React.SyntheticEvent, newValue: string) => { 
    if (onNavChange) {
      onNavChange(newValue);
    }
  };

  return (
    <AppBar position="relative" style={{ backgroundColor: '#d74009c0', boxShadow: 'none' }}>
      <Box sx={boxStyle}>
        <PortalNavigationTabs handleNavChange={handleNavChange} navItems={navItems} selected={selected} />
      </Box>
    </AppBar>
  );
}

export default PortalNavigationBar;

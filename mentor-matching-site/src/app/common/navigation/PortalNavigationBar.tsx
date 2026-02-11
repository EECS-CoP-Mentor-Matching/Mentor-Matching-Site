import * as React from 'react';
import { AppBar, Box } from '@mui/material';
import PortalNavigationTabs from './PortalNavigationTabs';

// You can delete or comment out the widthOffset constant as it's no longer needed for centering.

const boxStyle = {
  // Remove the explicit width and paddingLeft overrides which were causing the cutoff:
  // width: {
  //   xs: `${100 - widthOffset.xs}%`,
  //   sm: `${100 - widthOffset.sm}%`,
  //   md: `${100 - widthOffset.md}%`,
  //   lg: `${100 - widthOffset.lg}%`,
  //   xl: `${100 - widthOffset.xl}%`
  // },
  // paddingLeft: {
  //   xs: `${widthOffset.xs}%`,
  //   sm: `${widthOffset.sm}%`,
  //   md: `${widthOffset.md}%`,
  //   lg: `${widthOffset.lg}%`,
  //   xl: `${widthOffset.xl}%`
  // },
  
  // Use Flexbox to center the content within the available space:
  display: 'flex',
  justifyContent: 'center', 

  border: 'none',
  marginBottom: '2px',
  // overflowX: 'auto', // Keep this for responsiveness if needed
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
    // AppBar will now fill the rest of the available width after the sidebar
    <AppBar position="relative" style={{ backgroundColor: '#d74009c0', boxShadow: 'none'}} >
      <Box sx={boxStyle}>
        {/* PortalNavigationTabs will be centered within this box */}
        <PortalNavigationTabs handleNavChange={handleNavChange} navItems={navItems} selected={selected} />
      </Box>
    </AppBar>
  );
}

export default PortalNavigationBar;

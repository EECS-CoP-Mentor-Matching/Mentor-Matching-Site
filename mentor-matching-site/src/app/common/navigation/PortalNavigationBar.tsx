import * as React from 'react';
import { AppBar, Box } from '@mui/material';
import PortalNavigationTabs from './PortalNavigationTabs';

const widthOffset = {
  xs: 0,
  sm: 10,
  md: 10,
  lg: 15,
  xl: 30
}

const boxStyle = {
  width: {
    xs: `${100 - widthOffset.xs}%`,
    sm: `${100 - widthOffset.sm}%`,
    md: `${100 - widthOffset.md}%`,
    lg: `${100 - widthOffset.lg}%`,
    xl: `${100 - widthOffset.xl}%`
  },
  paddingLeft: {
    xs: `${widthOffset.xs}%`,
    sm: `${widthOffset.sm}%`,
    md: `${widthOffset.md}%`,
    lg: `${widthOffset.lg}%`,
    xl: `${widthOffset.xl}%`
  },
  border: 'none',
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

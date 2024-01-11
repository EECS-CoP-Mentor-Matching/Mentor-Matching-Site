import * as React from 'react';
import { AppBar, Tabs, Tab, Box } from '@mui/material';

type TopNavigationBarProps = {
  navItems?: string[];
  selected?: string;
  onNavChange?: (newValue: string) => void;
};

const TopNavigationBar = ({ navItems, selected, onNavChange }: TopNavigationBarProps) => {
  const handleNavChange = (event: React.SyntheticEvent, newValue: string) => { // Add type for newValue
    if (onNavChange) {
      onNavChange(newValue);
    }
  };
  return (
    <AppBar position="static" style={{ backgroundColor: '#DC4405', boxShadow: 'none' }}>
      <Box sx={{ width: '100%', paddingLeft: '20%', marginBottom: '2px', overflowX: 'auto' }}>
        <Tabs
          value={selected}
          onChange={handleNavChange}
          aria-label="navigation tabs"
          textColor="inherit"
          indicatorColor="secondary"
        >
          {navItems?.map(item => (
            <Tab key={item} value={item} label={item} />
          ))}
        </Tabs>
      </Box>
    </AppBar>
  );
}

export default TopNavigationBar;

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
            <Box sx={{ width: '100%', marginLeft: '20%', marginBottom: '2px',  overflowX: 'auto' }}>
                <Tabs
                    value={selected}
                    onChange={handleNavChange}
                    aria-label="navigation tabs"
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{
                        '.MuiTab-root': {
                            color: '#FFFFFF',
                            fontWeight: 'bold',
                            fontSize: {
                                xs: '0.75rem',
                                sm: '0.875rem',
                                md: '1rem',
                            },
                            textTransform: 'none',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                            padding: {
                                xs: 1,
                                sm: 1.5,
                                md: 2,
                            },
                        },
                        '.Mui-selected': {
                            color: '#87CEEB',
                        },
                        '.MuiTabs-indicator': {
                            backgroundColor: '#87CEEB',
                        },
                    }}
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

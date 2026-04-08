import { Tab, Tabs } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";

const tabStyle = {
  fontSize: {
    xs: '0.7rem',
    sm: '0.875rem',
    md: '1.00rem',
    lg: '1.00rem',
    xl: '1.00rem'
  },
  marginRight: {
    xs: '0',
    sm: '0',
    md: '1.50rem',
    lg: '1.50rem',
    xl: '1.50rem'
  },
  minWidth: {
    xs: 'unset',
    md: '90px',
  },
  padding: {
    xs: '6px 8px',
    md: '12px 16px',
  },
}

interface TabProps {
  navItems?: string[];
  selected?: string;
  handleNavChange: (event: React.SyntheticEvent, newValue: string) => void
}

function PortalNavigationTabs({ navItems, selected, handleNavChange }: TabProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Tabs
      value={selected}
      onChange={handleNavChange}
      aria-label="navigation tabs"
      textColor="inherit"
      indicatorColor="secondary"
      variant={isMobile ? "scrollable" : "standard"}
      scrollButtons={isMobile ? "auto" : false}
      allowScrollButtonsMobile
      centered={!isMobile}
      sx={{ border: 'none', width: '100%' }}
    >
      {navItems?.map(item => (
        <Tab sx={tabStyle} key={item} value={item} label={item} />
      ))}
    </Tabs>
  );
}

export default PortalNavigationTabs;

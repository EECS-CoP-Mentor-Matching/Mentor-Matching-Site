import { Tab, Tabs } from "@mui/material";

const style = {
  fontSize: {
    xs: '0.75rem',
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
}

interface TabProps {
  navItems?: string[];
  selected?: string;
  handleNavChange: (event: React.SyntheticEvent, newValue: string) => void
}

function PortalNavigationTabs({ navItems, selected, handleNavChange }: TabProps) {
  return (
    <Tabs
      value={selected}
      onChange={handleNavChange}
      aria-label="navigation tabs"
      textColor="inherit"
      indicatorColor="secondary"
      sx={{ border: 'none' }}
    >
      {navItems?.map(item => (
        <Tab sx={style} key={item} value={item} label={item} />
      ))}
    </Tabs>
  );
}

export default PortalNavigationTabs;
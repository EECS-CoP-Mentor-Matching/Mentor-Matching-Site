import { Button } from "@mui/material";
import "./MenteePortalNav.css";
import { Pages } from "./MenteePortal";

interface MenteePortalNavProps {
  setPage: (page: Pages) => void
}

function MenteePortalNav(props: MenteePortalNavProps) {
  return (
    <div className="nav">
      <Button onClick={() => props.setPage(Pages.createProfile)}>Create new Profile</Button>
      <Button onClick={() => props.setPage(Pages.activeProfiles)}>Active Profiles</Button>
      <Button onClick={() => props.setPage(Pages.viewMatches)}>View Matches</Button>
    </div>
  );
}

export default MenteePortalNav;
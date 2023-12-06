import { Button } from "@mui/material";
import "./AdminPortalNav.css";
import { Pages } from "./AdminPortal";

interface AdminPortalNavProps {
  setPage: (page: Pages) => void;
}

function AdminPortalNav(props: AdminPortalNavProps) {
  return (
    <div className="nav">
      <Button onClick={() => props.setPage(Pages.manageUsers)}>Manage Users</Button>
      <Button onClick={() => props.setPage(Pages.viewReports)}>View Reports</Button>
      <Button onClick={() => props.setPage(Pages.settings)}>Settings</Button>
    </div>
  );
}

export default AdminPortalNav;
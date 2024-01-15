import { useEffect, useState } from 'react';
import adminService from '../../service/adminService';
import "./AdminPortal.css";
import { Button } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import ManageUsers from './components/manageUsers/ManageUsers';
import ViewReports from './components/viewReports/ViewReports';
import Settings from './components/settings/Settings';
import PageNav from '../common/PageNav';
import PortalNavigationBar from '../common/navigation/PortalNavigationBar';
import navUtilities from '../common/navigation/navUtilities';

export enum Pages {
  manageUsers = "Manage Users",
  viewReports = "View Reports",
  settings = "Settings"
}

interface AdminPortalProps {
}

function AdminPortal(props: AdminPortalProps) {
  const [page, setPage] = useState(Pages.manageUsers.toString());
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthState = async () => {
      const user = await authService.getSignedInUser();
      if (user === undefined) {
        navigate("/login");
      }
    };
    checkAuthState();
  });

  return (
    <>
      <PortalNavigationBar selected={page} onNavChange={setPage} navItems={navUtilities.navItemsFromEnum(Pages)} />
      {/* <AdminPortalNav setPage={setPage} /> */}
      {/* {page === Pages.manageUsers && <ManageUsers />}
      {page === Pages.viewReports && <ViewReports />}
      {page === Pages.settings && <Settings />} */}
    </>
  );
}

export default AdminPortal;
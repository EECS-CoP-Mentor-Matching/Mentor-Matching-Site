import { useEffect, useState } from 'react';
import adminService from '../../service/adminService';
import "./AdminPortal.css";
import { Button } from "@mui/material";
import AdminPortalNav from './AdminPortalNav';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import ManageUsers from './manageUsers/ManageUsers';
import ViewReports from './viewReports/ViewReports';
import Settings from './settings/Settings';

export enum Pages {
  manageUsers,
  viewReports,
  settings
}

interface AdminPortalProps {
}

function AdminPortal(props: AdminPortalProps) {
  const [page, setPage] = useState(Pages.manageUsers);
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
      <AdminPortalNav setPage={setPage} />
      {page === Pages.manageUsers && <ManageUsers />}
      {page === Pages.viewReports && <ViewReports />}
      {page === Pages.settings && <Settings />}
    </>
  );
}

export default AdminPortal;
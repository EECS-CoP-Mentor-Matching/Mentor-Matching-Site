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

  const pages = [
    { pageId: 0, label: "manage users", component: <ManageUsers /> }
  ]

  return (
    <>
      <PageNav pages={pages} defaultPage={0} />
      {/* <AdminPortalNav setPage={setPage} /> */}
      {/* {page === Pages.manageUsers && <ManageUsers />}
      {page === Pages.viewReports && <ViewReports />}
      {page === Pages.settings && <Settings />} */}
    </>
  );
}

export default AdminPortal;
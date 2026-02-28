// src/components/manage/ManageUsers.tsx
import React, { useEffect, useState } from "react";
import {Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box} from "@mui/material";
import userService from "../../../../service/userService"; // adjust path if needed
import { UserProfile } from "../../../../types/userProfile";
import ContentContainer from "../../../common/ContentContainer";
import { Link } from "react-router-dom";

function ManageUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);

  const fetchUsers = async() => {
    try {
      const result = await userService.getAllUserProfiles();
      setUsers(result.length ? result : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => {
     fetchUsers();
  }, []);

  return (
    <ContentContainer
        title="Manage Users"
        subtitle="A table of active users enrolled in Mentor Match"
    >
    <Link to="/admin-portal/pending-users">View Pending User Accounts</Link>
    <Box sx={{ minWidth: '500px', paddingInline: "20%", paddingBlockStart: 2, margin: 'auto' }}>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Profile</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.UID}>
                  <TableCell>
                    <Link to={"/admin-portal/edit-user/" + u.UID}>
                      <Avatar
                        src={u.profilePictureUrl || u.imageUrl} // There are two places for profile pictures?
                      />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link to={"/admin-portal/edit-user/" + u.UID}>{u.contact?.displayName || "No name"}</Link>
                  </TableCell>

                  <TableCell>{u.contact?.email || "N/A"}</TableCell>

                  <TableCell>{u.preferences?.role || "N/A"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      </ContentContainer>
  );
}

export default ManageUsers;
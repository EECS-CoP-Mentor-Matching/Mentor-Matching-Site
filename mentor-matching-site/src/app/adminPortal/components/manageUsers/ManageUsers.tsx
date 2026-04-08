// src/components/manage/ManageUsers.tsx
import React, { useEffect, useState } from "react";
import { Avatar, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getFunctions, httpsCallable } from "firebase/functions";
import userService from "../../../../service/userService";
import { UserProfile } from "../../../../types/userProfile";
import ContentContainer from "../../../common/ContentContainer";
import { Link } from "react-router-dom";

const deleteUserAccount = httpsCallable(getFunctions(), "deleteUserAccount");

function ManageUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [openConfirm, setOpenConfirm] = useState(false);

  const fetchUsers = async () => {
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

  const handleDeleteClick = (user: UserProfile) => {
    setUserToDelete(user);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        // Delete Firestore profile first, then remove Firebase Auth record
        await userService.deleteUserProfile(userToDelete.UID);
        await deleteUserAccount({ uid: userToDelete.UID });
        setUsers(prev => prev.filter(u => u.UID !== userToDelete.UID));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    setUserToDelete(null);
    setOpenConfirm(false);
  };

  const handleCancelDelete = () => {
    setUserToDelete(null);
    setOpenConfirm(false);
  };

  return (
    <ContentContainer
      title="Manage Users"
      subtitle="A table of active users enrolled in Mentor Match"
    >
      <Link to="/admin-portal/pending-users">View Pending User Accounts</Link>
      <Box sx={{ paddingInline: { xs: "4px", md: "20%" }, paddingBlockStart: 2, paddingBottom: 6, margin: "auto", boxSizing: "border-box", overflowX: "auto" }}>
        <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Profile</TableCell>
                <TableCell>Name</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Email</TableCell>
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Role</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {users.map((u) => (
                <TableRow key={u.UID}>
                  <TableCell>
                    <Link to={"/admin-portal/edit-user/" + u.UID}>
                      <Avatar src={u.profilePictureUrl || u.imageUrl} />
                    </Link>
                  </TableCell>

                  <TableCell>
                    <Link to={"/admin-portal/edit-user/" + u.UID}>{u.contact?.displayName || "No name"}</Link>
                  </TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{u.contact?.email || "N/A"}</TableCell>

                  <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>{u.preferences?.role || "N/A"}</TableCell>

                  <TableCell align="center">
                    <IconButton
                      onClick={() => handleDeleteClick(u)}
                      size="small"
                      sx={{
                        color: 'grey.500',
                        '&:hover': { color: 'error.main' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog open={openConfirm} onClose={handleCancelDelete}>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete <strong>{userToDelete?.contact?.displayName || "this user"}</strong> ({userToDelete?.contact?.email})?
            <br /><br />
            This will permanently remove their profile and authentication record. They will need to create a completely new account if they wish to rejoin.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" variant="contained">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>

    </ContentContainer>
  );
}

export default ManageUsers;
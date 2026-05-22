import React, { useEffect, useState } from "react";
import {
  Avatar, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Box, IconButton, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Button, TextField,
  Alert, CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { getFunctions, httpsCallable } from "firebase/functions";
import userService from "../../../../service/userService";
import { UserProfile } from "../../../../types/userProfile";
import ContentContainer from "../../../common/ContentContainer";
import { Link } from "react-router-dom";

const deleteUserAccount = httpsCallable(getFunctions(), "deleteUserAccount");
const preAuthorizeUser  = httpsCallable(getFunctions(), "preAuthorizeUser");

function ManageUsers() {
  const [users, setUsers]               = useState<UserProfile[]>([]);
  const [userToDelete, setUserToDelete] = useState<UserProfile | null>(null);
  const [openConfirm, setOpenConfirm]   = useState(false);

  // Invite dialog
  const [openInvite, setOpenInvite]     = useState(false);
  const [inviteEmail, setInviteEmail]   = useState("");
  const [inviting, setInviting]         = useState(false);
  const [inviteResult, setInviteResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchUsers = async () => {
    try {
      const result = await userService.getAllUserProfiles();
      setUsers(result.length ? result : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // ── Delete handlers ──────────────────────────────────────────────────────
  const handleDeleteClick = (user: UserProfile) => {
    setUserToDelete(user);
    setOpenConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
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

  // ── Invite handlers ──────────────────────────────────────────────────────
  const handleOpenInvite = () => {
    setInviteEmail("");
    setInviteResult(null);
    setOpenInvite(true);
  };

  const handleCloseInvite = () => {
    setOpenInvite(false);
    setInviteEmail("");
    setInviteResult(null);
  };

  const handleSendInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteResult(null);
    try {
      await preAuthorizeUser({ email: inviteEmail.trim() });
      setInviteResult({
        success: true,
        message: `Invitation sent to ${inviteEmail}. They will receive an email with a link to set up their password and join Mentor Match.`,
      });
      setInviteEmail("");
    } catch (error: any) {
      setInviteResult({
        success: false,
        message: error?.message ?? "Failed to send invitation. Please try again.",
      });
    } finally {
      setInviting(false);
    }
  };

  return (
    <ContentContainer
      title="Manage Users"
      subtitle="A table of active users enrolled in Mentor Match"
    >
      <Box sx={{ paddingInline: { xs: "4px", md: "20%" }, paddingBlockStart: 2, paddingBottom: 6, margin: "auto", boxSizing: "border-box", overflowX: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "space-between", alignItems: { xs: "flex-start", sm: "center" }, gap: 1, mb: 2 }}>
          <Link to="/admin-portal/pending-users">View Pending User Accounts</Link>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleOpenInvite}
            sx={{ bgcolor: "#DC4405", "&:hover": { bgcolor: "#b83804" }, width: { xs: "100%", sm: "auto" } }}
          >
            Invite Non-OSU User
          </Button>
        </Box>
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
                      sx={{ color: "grey.500", "&:hover": { color: "error.main" } }}
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

      {/* ── Delete confirmation dialog ── */}
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

      {/* ── Invite Non-OSU User dialog ── */}
      <Dialog open={openInvite} onClose={handleCloseInvite} maxWidth="sm" fullWidth>
        <DialogTitle>Invite Non-OSU User</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Enter the email address of the person you'd like to invite. They will
            receive an email with a link to set up their password and will be
            pre-authorized to join Mentor Match without going through the approval process.
          </DialogContentText>

          {inviteResult && (
            <Alert
              severity={inviteResult.success ? "success" : "error"}
              sx={{ mb: 2 }}
              onClose={() => setInviteResult(null)}
            >
              {inviteResult.message}
            </Alert>
          )}

          <TextField
            label="Email Address"
            type="email"
            fullWidth
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSendInvite(); }}
            disabled={inviting}
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInvite}>Close</Button>
          <Button
            onClick={handleSendInvite}
            variant="contained"
            disabled={inviting || !inviteEmail.trim()}
            startIcon={inviting ? <CircularProgress size={16} color="inherit" /> : <PersonAddIcon />}
            sx={{ bgcolor: "#DC4405", "&:hover": { bgcolor: "#b83804" } }}
          >
            {inviting ? "Sending…" : "Send Invite"}
          </Button>
        </DialogActions>
      </Dialog>

    </ContentContainer>
  );
}

export default ManageUsers;

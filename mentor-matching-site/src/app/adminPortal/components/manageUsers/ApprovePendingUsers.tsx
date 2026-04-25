import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";
import userService from "../../../../service/userService";
import { sendEmail } from "../../../../service/mailService";
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Table, TableBody, TableCell, TableHead, TableRow, Chip } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useAppSelector } from "../../../../redux/hooks";

const approvePendingUser = httpsCallable(getFunctions(), "approvePendingUser");
const deleteUserAccount = httpsCallable(getFunctions(), "deleteUserAccount");

const SITE_URL = "https://eecs-cop-mentor-matching-site.web.app";

function ApprovePendingUsers() {

  const currentUserId = useAppSelector(state => state.userProfile.userProfile.UID);
  const [pendingUserList, setPendingUserList] = useState<any[]>([]);
  const [denyTarget, setDenyTarget] = useState<any | null>(null);
  const [processing, setProcessing] = useState<string | null>(null); // tracks which uid is being processed

  const fetchPendingUsers = async () => {
    try {
      const userList = await userService.getAllPendingUsers();
      setPendingUserList(userList);
    } catch (error) {
      console.error("An error occurred fetching pending user list.");
    }
  };

  useEffect(() => {
    async function getPendingUsers() {
      await fetchPendingUsers();
    }
    getPendingUsers();
  }, []);

  async function handleApproveUser(uid: string, email: string) {
    setProcessing(uid);
    try {
      // Approve user in Firebase Auth
      await approvePendingUser({ uid });

      // Send approval email
      await sendEmail({
        to: email,
        subject: "Your Mentor Match Account Has Been Approved! 🎉",
        text: `Hi there!\n\nGreat news — your Mentor Match account has been approved by our team!\n\nYou can now log in and complete your profile setup at:\n${SITE_URL}/new-profile\n\nWe're excited to have you join our community!\n\nThe EECS Mentor Match Team`
      });

      // Refresh the pending users list
      await fetchPendingUsers();
    } catch (error) {
      console.error("Error approving user: ", error);
      alert("Failed to approve user. Do you have admin permissions?");
    }
    setProcessing(null);
  }

  async function handleDenyUser(uid: string, email: string) {
    setProcessing(uid);
    try {
      // Remove from pendingUsers Firestore collection
      await userService.deletePendingUser(uid);

      // Remove from Firebase Auth
      await deleteUserAccount({ uid });

      // Send denial email
      await sendEmail({
        to: email,
        subject: "Update on Your Mentor Match Account Request",
        text: `Hi there,\n\nThank you for your interest in EECS Mentor Match. Unfortunately, we are unable to approve your account request at this time.\n\nIf you have any questions please contact us at:\n${SITE_URL}/contact-us\n\nThe EECS Mentor Match Team`
      });

      // Refresh the pending users list
      await fetchPendingUsers();
    } catch (error) {
      console.error("Error denying user: ", error);
      alert("Failed to deny user. Do you have admin permissions?");
    }
    setProcessing(null);
    setDenyTarget(null);
  }

  return (
    <>
      <h3>Users awaiting approval:</h3>

      {pendingUserList.length === 0 && (
        <p style={{ textAlign: 'center', color: '#999', fontStyle: 'italic', marginTop: '20px' }}>
          No users currently awaiting approval.
        </p>
      )}

      <Box sx={{ maxWidth: 750, margin: "30px auto", padding: "10px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Requested</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pendingUserList.map((pendingUser) => (
              <TableRow key={pendingUser.uid}>
                <TableCell>{pendingUser.details.email}</TableCell>
                <TableCell>
                  {Timestamp.fromMillis(pendingUser.details.createdAt.seconds * 1000).toDate().toDateString()}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      disabled={processing === pendingUser.uid}
                      onClick={() => handleApproveUser(pendingUser.uid, pendingUser.details.email)}
                    >
                      {processing === pendingUser.uid ? 'Processing...' : 'Approve'}
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={processing === pendingUser.uid}
                      onClick={() => setDenyTarget(pendingUser)}
                    >
                      Deny
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Deny confirmation dialog */}
      <Dialog open={denyTarget !== null} onClose={() => setDenyTarget(null)}>
        <DialogTitle>Deny Account Request</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deny the account request for <strong>{denyTarget?.details?.email}</strong>?
            <br /><br />
            This will remove their account from Firebase and send them a denial email. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDenyTarget(null)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => handleDenyUser(denyTarget.uid, denyTarget.details.email)}
          >
            Deny & Notify
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ApprovePendingUsers;

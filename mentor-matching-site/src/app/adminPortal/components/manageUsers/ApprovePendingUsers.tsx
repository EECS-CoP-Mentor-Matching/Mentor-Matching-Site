import {getFunctions, httpsCallable} from "firebase/functions";
import { useEffect, useState } from "react";
import userService from "../../../../service/userService";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useAppSelector } from "../../../../redux/hooks";

const adminFunctions = getFunctions();
const approvePendingUser = httpsCallable(getFunctions(), "approvePendingUser");




function ApprovePendingUsers()
{

    // DEBUG: This gives the user "admin" privilege in Firebase, which is not done by default.  This is here for debugging purposes, but should be moved later:
    const currentUserId = useAppSelector(state => state.userProfile.userProfile.UID);
    const setAdminPrivileges = httpsCallable(getFunctions(), "setAdminPrivileges");

    console.log("Currently logged in as:", currentUserId);


    const [pendingUserList, setPendingUserList] = useState<any[]>([]);

    const fetchPendingUsers = async () => {
        try {
            const userList = await userService.getAllPendingUsers();
            setPendingUserList(userList);
        }
        catch (error) {
            console.error("An error occurred fetching pending user list.")
        }
    };

    useEffect(() => {
        async function adminSetup() { // Fetches a list of pending users and also sets the account as admin:
            await fetchPendingUsers();
            await setAdminPrivileges({uid: currentUserId});
        }
        adminSetup();
    }, [currentUserId]);

    console.log(pendingUserList);

    async function handleApproveUser(uid: string) {
        // Function to handle the click for the approe button.  Takes the user's ID and marks them as approved in Firebase.
        try {
            const approveResult = await approvePendingUser({ uid });
            // Log the results for debugging purposes:
            console.log("Approval result: ", approveResult.data);
            // approveResult also deletes the user from the pendingUsers table.  Let's refresh the entries we have on the screen:
            await fetchPendingUsers();
        }
        catch (error) {
            console.log("Error approving user: ", error);
        }
    }


    return(
        <>

            <h3>DEBUG! On loading, this page makes a call that gives your account Firebase permissions.  Please log out after loading it for the first time and come back for the new permissions to take effect.</h3>
            {pendingUserList && pendingUserList.map((pendingUser: any) => 
                    <p>{pendingUser.uid}: {pendingUser.details.email}</p>
                )
            };
            <Box sx={{
                maxWidth: 750,
                margin: "30px auto",
                padding: "10px"
                }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Email</TableCell>
                            <TableCell>Timestamp</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>{pendingUserList.map((pendingUser) => (
                        <TableRow key={pendingUser.uid}>
                            <TableCell>{pendingUser.details.email}</TableCell>
                            <TableCell>{Timestamp.fromMillis(pendingUser.details.createdAt.seconds*1000).toDate().toDateString()}</TableCell>
                            <TableCell><Button onClick={() => handleApproveUser(pendingUser.uid)}>Approve</Button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}

export default ApprovePendingUsers;
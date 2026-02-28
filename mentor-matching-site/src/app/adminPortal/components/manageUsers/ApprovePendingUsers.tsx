import {getFunctions, httpsCallable} from "firebase/functions";
import { useEffect, useState } from "react";
import userService from "../../../../service/userService";
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import { Timestamp } from "firebase/firestore";

const adminFunctions = getFunctions();
const approvePendingUser = httpsCallable(getFunctions(), "approvePendingUser");

function ApprovePendingUsers()
{
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
        fetchPendingUsers();
    }, []);

    console.log(pendingUserList);

    async function handleApproveUser(uid: string) {
        // Function to handle the click for the approe button.  Takes the user's ID and marks them as approved in Firebase.
        try {
            const approveResult = await approvePendingUser(uid);
            // Log the results for debugging purposes:
            console.log("Approval result: ", approveResult.data);
        }
        catch (error) {
            console.log("Error approving user: ", error);
        }

    }

    return(
        <>

            DEBUG!  A list of pending users with the option to approve them will be coming soon!
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
                            <TableCell><Button>Approve</Button></TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Box>
        </>
    );
}

export default ApprovePendingUsers;
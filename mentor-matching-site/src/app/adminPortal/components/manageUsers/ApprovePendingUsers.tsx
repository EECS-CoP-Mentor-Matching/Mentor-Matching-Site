import {getFunctions, httpsCallable} from "firebase/functions";
import { useEffect, useState } from "react";
import userService from "../../../../service/userService";

const adminFunctions = getFunctions();
const approvePendingUser = httpsCallable(getFunctions(), "approvePendingUser");

function ApprovePendingUsers()
{
    const [pendingUserList, setPendingUserList] = useState<any>();

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
    
    return(
        <>
            DEBUG!  A list of pending users with the option to approve them will be coming soon!
            {pendingUserList && console.log(pendingUserList)}
        </>
    );
}

export default ApprovePendingUsers;
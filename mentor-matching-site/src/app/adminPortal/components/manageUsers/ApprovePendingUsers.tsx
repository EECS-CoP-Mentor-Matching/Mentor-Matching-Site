import {getFunctions, httpsCallable} from "firebase/functions";
import { useState } from "react";
import userService from "../../../../service/userService";

const adminFunctions = getFunctions();
const approvePendingUser = httpsCallable(getFunctions(), "approvePendingUser");

function ApprovePendingUsers()
{
    return(
        <>
            DEBUG!  A list of pending users with the option to approve them will be coming soon!
            {console.log(userService.getAllPendingUsers())}
        </>
    );
}

export default ApprovePendingUsers;
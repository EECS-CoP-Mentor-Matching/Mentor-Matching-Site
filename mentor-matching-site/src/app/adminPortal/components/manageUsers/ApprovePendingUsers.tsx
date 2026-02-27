import {getFunctions, httpsCallable} from "firebase/functions";
import { useState } from "react";

const adminFunctions = getFunctions();
const approvePendingUser = httpsCallable(getFunctions(), "approvePendingUser");

function ApprovePendingUsers()
{
    return(
        <>
            DEBUG!  A list of pending users with the option to approve them will be coming soon!
        </>
    );
}

export default ApprovePendingUsers;
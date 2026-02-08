import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormGroup } from "@mui/material";
import userService from '../../../../service/userService';
import { UserProfile } from '../../../../types/userProfile';

function ManageUserProfile() {
    // Expects a user ID provided as part of the URL.  Will extract the ID
    // and attempt to look the user up in our database to populate the
    // edit user form.

    const {userID} = useParams();
    let userProfile: UserProfile | null | undefined = undefined;

    useEffect(() => {
        const getUserProfile = async () => {
            if (userID)
            {
                userProfile = await userService.getUserProfile(userID);
            }
        };
    }, []);

    

    return (
        <>
            <p> Received user ID: {userID}</p>
        </>
    )

}

export default ManageUserProfile;
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
    const [userProfile, setUserProfile] = useState<UserProfile>()

    useEffect(() => {
        const getUserProfile = async () => {
            if (userID)
            {
                setUserProfile(await userService.getUserProfile(userID));
            }
        };
        getUserProfile();
    }, []);

    

    return (
        <>
            <p> Received user ID: {userID} with display name: {userProfile?.contact.displayName}</p>
        </>
    )

}

export default ManageUserProfile;
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormGroup } from "@mui/material";
import userService from '../../../../service/userService';
import { UserProfile } from '../../../../types/userProfile';
import UploadUserProfileImage from '../../../userProfileCommon/imageUpload/UploadUserProfileImage';
import UpdatePersonalInformation from '../../../updateUserProfile/components/UpdatePersonalInformation';
import UpdateUserContactInformation from '../../../updateUserProfile/components/UpdateUserContactInformation';
import UpdateUserDemographicInformation from '../../../updateUserProfile/components/UpdateDemographicsInformation';
import UpdateEducationInformation from '../../../updateUserProfile/components/UpdateEducationInformation';

function ManageUserProfile() {
    // Expects a user ID provided as part of the URL.  Will extract the ID
    // and attempt to look the user up in our database to populate the
    // edit user form.

    // User ID received from the URL parameter:
    const {userID} = useParams();
    // User Profile fetched using that ID, if any:
    const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>()
    // Switch for the edit feature of the form:
    const [showEdit, setShowEdit] = useState(true);
    const showEditStyle = {
        borderBottom: showEdit ? "solid orange 1px" : ""
    }

    useEffect(() => {
        const getUserProfile = async () => {
            if (userID) // Check to ensure that a user ID was passed in as a parameter
            {
                setCurrentUserProfile(await userService.getUserProfile(userID));
                console.log(currentUserProfile);
            }
        };
        getUserProfile();
    }, []);

    const saveChanges = async () => {
        if (currentUserProfile) // Check to ensure that thte profile has been pulled in before we continue
        {
            await userService.updateUserProfile(currentUserProfile.UID, currentUserProfile);
            setShowEdit(false);
        }
    }

    const dataIsLoading = () => {
    if (currentUserProfile === undefined) {
      return (<>Data is loading...</>);
    } else {
      return  (
        <FormGroup sx={{ gap: '3.5rem', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
            <UploadUserProfileImage userProfile={{ ...currentUserProfile, imageUrl: currentUserProfile?.imageUrl }} />
            <UpdatePersonalInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={currentUserProfile} />
            <UpdateUserContactInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={currentUserProfile} />
            <UpdateUserDemographicInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={currentUserProfile} />
            <UpdateEducationInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={currentUserProfile} />
        </FormGroup>
      );
    }
  }

    return (
        <>
            <p> Received user ID: {userID} with display name: {currentUserProfile?.contact.displayName}</p>
            {dataIsLoading()}
        </>
    )

}

export default ManageUserProfile;
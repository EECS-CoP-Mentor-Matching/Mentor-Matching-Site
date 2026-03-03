import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormGroup, Menu } from "@mui/material";
import userService from '../../../../service/userService';
import { UserProfile } from '../../../../types/userProfile';
import UploadUserProfileImage from '../../../userProfileCommon/imageUpload/UploadUserProfileImage';
import AuthenticatedView from '../../../common/auth/AuthenticatedView';
import UnauthenticatedView from '../../../common/auth/UnauthenticatedView';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { updateProfile } from '../../../../redux/reducers/userProfileReducer';
import UpdatePersonalInformation from '../../../common/manageUsers/UpdatePersonalInformation';
import UpdateUserContactInformation from '../../../common/manageUsers/UpdateUserContactInformation';
import Messages from '../../../common/messaging/Messages';


function ManageUserProfile() {
    // Expects a user ID provided as part of the URL.  Will extract the ID
    // and attempt to look the user up in our database to populate the
    // edit user form.

    // User ID received from the URL parameter:
    const {userID} = useParams();
    // Switch for the edit feature of the form:
    const [showEdit, setShowEdit] = useState(false);
    // State to store the profile details that we are planning to edit:
    const [profileDetails, setProfileDetails] = useState<UserProfile | null>(null);
    // State to manage showing the messages popout
    const [anchorElement, setAnchorElement] = useState<null | HTMLElement>(null);
    const handleMessagesClick = (event: React.MouseEvent<HTMLButtonElement>) => {setAnchorElement(event.currentTarget)};
    const handleMessagesClose = () => {setAnchorElement(null)};
    const showEditStyle = {
        borderBottom: showEdit ? "solid orange 1px" : ""
    }

    useEffect(() => {
        const getUserProfile = async () => {
            if (userID) // Check to ensure that a user ID was passed in as a parameter
            {
                const profile = await userService.getUserProfile(userID);
                setProfileDetails(profile);
            }
        };
        getUserProfile();
    }, [userID]); // Rerun this if the userID changes-- which means the URL parameter changed.

    const saveChanges = async () => {
        if (profileDetails) // Check to ensure that thte profile has been pulled in before we continue
        {
            await userService.updateUserProfile(profileDetails.UID, profileDetails);
            setShowEdit(false);
        }
    }

    const dataIsLoading = () => {
    if (profileDetails === null) {
      return (<>Data is loading...</>);
    } else {
      return  (
        <FormGroup sx={{ gap: '3.5rem', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
            <UploadUserProfileImage userProfile={{ ...profileDetails, imageUrl: profileDetails?.imageUrl }} />
            <UpdatePersonalInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={profileDetails} onChange={setProfileDetails} />
            <UpdateUserContactInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={profileDetails} onChange={setProfileDetails} />
        </FormGroup>
      );
    }
  }

    return (
        <>
            <AuthenticatedView>
                <p> User ID: {userID} with display name: {profileDetails?.contact.displayName}</p>
                <Button onClick={handleMessagesClick}>View Messages</Button>
                <Menu
                  open={(Boolean(anchorElement))}
                  anchorEl={anchorElement}
                  onClose={handleMessagesClose}
                  >
                    {profileDetails &&
                        <Messages userProfile={profileDetails} adminView={true} />
                    }

                    
                </Menu>
                {dataIsLoading()}
                {!showEdit &&
                    <Button onClick={() => { setShowEdit(true) }}>Edit Profile</Button>
                }
                {showEdit &&
                    <Button onClick={saveChanges}>Save Profile</Button>
                }
            </AuthenticatedView>
            <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
        </>
    )

}

export default ManageUserProfile;
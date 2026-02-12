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
import AuthenticatedView from '../../../common/auth/AuthenticatedView';
import UnauthenticatedView from '../../../common/auth/UnauthenticatedView';
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks';
import { updateProfile } from '../../../../redux/reducers/userProfileReducer';


function ManageUserProfile() {
    // Expects a user ID provided as part of the URL.  Will extract the ID
    // and attempt to look the user up in our database to populate the
    // edit user form.

    // User ID received from the URL parameter:
    const {userID} = useParams();
    // Switch for the edit feature of the form:
    const [showEdit, setShowEdit] = useState(false);
    const dispatch = useAppDispatch();
    const userProfileState = useAppSelector(state => state.userProfile.userProfile);
    const showEditStyle = {
        borderBottom: showEdit ? "solid orange 1px" : ""
    }

    useEffect(() => {
        const getUserProfile = async () => {
            if (userID) // Check to ensure that a user ID was passed in as a parameter
            {
                const profile = await userService.getUserProfile(userID);
                dispatch(updateProfile(profile));
            }
        };
        getUserProfile();
    }, []);

    const saveChanges = async () => {
        if (userProfileState) // Check to ensure that thte profile has been pulled in before we continue
        {
            await userService.updateUserProfile(userProfileState.UID, userProfileState);
            setShowEdit(false);
        }
    }

    const dataIsLoading = () => {
    if (userProfileState === undefined) {
      return (<>Data is loading...</>);
    } else {
      return  (
        <FormGroup sx={{ gap: '3.5rem', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
            <UploadUserProfileImage userProfile={{ ...userProfileState, imageUrl: userProfileState?.imageUrl }} />
            <UpdatePersonalInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={userProfileState} />
            <UpdateUserContactInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={userProfileState} />
            <UpdateUserDemographicInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={userProfileState} />
            <UpdateEducationInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={userProfileState} />
        </FormGroup>
      );
    }
  }

    return (
        <>
            <AuthenticatedView>
                <p> Received user ID: {userID} with display name: {userProfileState?.contact.displayName}</p>
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
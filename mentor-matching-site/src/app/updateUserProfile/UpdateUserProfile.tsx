import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormGroup } from "@mui/material";
import "./UserProfile.css";
import authService from "../../service/authService";
import userService from "../../service/userService";
import UploadUserProfileImage from "../userProfileCommon/imageUpload/UploadUserProfileImage";
//import UpdatePersonalInformation from '../../../common/manageUsers/UpdatePersonalInformation';
import UpdatePersonalInformation from '../common/manageUsers/UpdatePersonalInformation';
import UpdateUserContactInformation from '../common/manageUsers/UpdateUserContactInformation';
import UpdateUserDemographicInformation from '../common/manageUsers/UpdateDemographicsInformation';
import UpdateEducationInformation from '../common/manageUsers/UpdateEducationInformation';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/userProfileReducer";
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import { UserProfile } from '../../types/userProfile';

function UpdateUserProfile() {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control the visibility of the confirmation dialog
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const userProfileState = selector(state => state.userProfile.userProfile);
  const [profileDetails, setProfileDetails] = useState<UserProfile | null>(userProfileState);

  const showEditStyle = {
    borderBottom: showEdit ? "solid orange 1px" : ""
  }

  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser) {
        const profile = await userService.getUserProfile(currentUser.uid);
        dispatch(updateProfile(profile));
      }
    };
    loadUserProfile();
  }, [dispatch]);

  const saveChanges = async () => {
    // Check to ensure that profileDetails populated, so we don't accidentally overwrite with a null user profile:
    if (profileDetails)
    {
          await userService.updateUserProfile(profileDetails.UID, profileDetails);
          // Let's refresh their account from the user store so that changes show up right away:
          dispatch(updateProfile(profileDetails))
          setShowEdit(!showEdit);

    }
  }

  // Function to open the delete dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // TODO: Copilot recommended changing this later to use the profile stored in state and not the one from the Redux store.  
  const handleDeleteAccount = async () => {
    // Assuming deleteUserProfile method exists and handles the deletion of user data
    await userService.deleteUserProfile(userProfileState.UID);
    await authService.signOut(); // Sign out the user after account deletion
    // Redirect to home or sign-in page after deletion
    window.location.href = "/";
  };

  const deleteAccountDialog = (
    <Dialog
      open={openDeleteDialog}
      onClose={handleCloseDeleteDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Delete Account"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to permanently delete your account? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
        <Button onClick={handleDeleteAccount} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );

  const dataIsLoading = () => {
    if (profileDetails === null) {
      return (<>Data is loading...</>);
    } else {
      return (
        <FormGroup sx={{ gap: '3.5rem', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
            <UploadUserProfileImage userProfile={{ ...profileDetails, imageUrl: profileDetails?.imageUrl }} />
            <UpdatePersonalInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={profileDetails} onChange={setProfileDetails} />
            <UpdateUserContactInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={profileDetails} onChange={setProfileDetails} />
            <UpdateUserDemographicInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={profileDetails} onChange={setProfileDetails} />
            <UpdateEducationInformation showEdit={showEdit} showEditStyle={showEditStyle} userProfile={profileDetails} onChange={setProfileDetails} />
        </FormGroup>
      );
    }
  }


    

  return (
    <>
      <AuthenticatedView>
        {dataIsLoading()}
        {deleteAccountDialog}
        {!showEdit &&
        <Button onClick={() => { setShowEdit(!showEdit) }}>Edit Profile</Button>
        }
        {showEdit &&
          <Button onClick={saveChanges}>Save Profile</Button>
        }
        <div style={{fontSize: '20px', textDecoration: "underline", margin: '4px' }} onClick={() => setShowDeleteButton(true)}>Looking to delete your account?</div>
        {/* Position the Delete Account button according to layout preference */}
        {showDeleteButton &&
          <Button variant="outlined" color="error" onClick={handleOpenDeleteDialog} style={{ marginTop: '20px' }}>
            Delete Account
          </Button>
        }
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default UpdateUserProfile;
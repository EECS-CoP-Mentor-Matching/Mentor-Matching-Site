import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormGroup } from "@mui/material";
import "./UserProfile.css";
import authService from "../../service/authService";
import userService from "../../service/userService";
import UploadUserProfileImage from "../userProfileCommon/imageUpload/UploadUserProfileImage";
import UpdatePersonalInformation from "./components/UpdatePersonalInformation";
import UpdateUserContactInformation from "./components/UpdateUserContactInformation";
import UpdateUserDemographicInformation from "./components/UpdateDemographicsInformation";
import UpdateEducationInformation from "./components/UpdateEducationInformation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/userProfileReducer";

function UpdateUserProfile() {
  const [showEdit, setShowEdit] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State to control the visibility of the confirmation dialog
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const userProfileState = selector(state => state.userProfile.userProfile);

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
    await userService.updateUserProfile(userProfileState.UID, userProfileState);
    setShowEdit(!showEdit);
  }

  // Function to open the delete dialog
  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true);
  };

  // Function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDeleteAccount = async () => {
    // Assuming deleteUserProfile method exists and handles the deletion of user data
    await userService.deleteUserProfile(userProfileState.UID);
    await authService.signOut(); // Sign out the user after account deletion
    // Redirect to home or sign-in page after deletion
    window.location.href = "/"; // Adjust the URL to your application's home or sign-in page
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
    if (userProfileState === undefined) {
      return (<>Data is loading...</>);
    } else {
      return dataDisplay;
    }
  }

  const dataDisplay = (
    <FormGroup sx={{ gap: '3.5rem', paddingTop: '2.5rem', paddingBottom: '4.5rem' }}>
      <UploadUserProfileImage userProfile={{ ...userProfileState, imageUrl: userProfileState.imageUrl }} />
      {!showEdit &&
        <Button onClick={() => { setShowEdit(!showEdit) }}>Edit Profile</Button>
      }
      {showEdit &&
        <Button onClick={saveChanges}>Save Profile</Button>
      }
      <UpdatePersonalInformation showEdit={showEdit} showEditStyle={showEditStyle} />
      <UpdateUserContactInformation showEdit={showEdit} showEditStyle={showEditStyle} />
      <UpdateUserDemographicInformation showEdit={showEdit} showEditStyle={showEditStyle} />
      <UpdateEducationInformation showEdit={showEdit} showEditStyle={showEditStyle} />
      {/* Adding the Delete Account button outside the FormGroup for layout purposes */}
    </FormGroup>
  );

  return (
    <>
      {dataIsLoading()}
      {deleteAccountDialog}
      {/* Position the Delete Account button according to layout preference */}
      <Button variant="outlined" color="error" onClick={handleOpenDeleteDialog} style={{ marginTop: '20px' }}>
        Delete Account
      </Button>
    </>
  );
}

export default UpdateUserProfile;
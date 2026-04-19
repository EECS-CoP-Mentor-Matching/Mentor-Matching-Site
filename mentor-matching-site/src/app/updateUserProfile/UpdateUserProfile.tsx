import { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, FormGroup } from "@mui/material";
import "./UserProfile.css";
import authService from "../../service/authService";
import userService from "../../service/userService";
import UploadUserProfileImage from "../userProfileCommon/imageUpload/UploadUserProfileImage";
import UpdatePersonalInformation from '../common/manageUsers/UpdatePersonalInformation';
import UpdateUserContactInformation from '../common/manageUsers/UpdateUserContactInformation';
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/userProfileReducer";
import AuthenticatedView from '../common/auth/AuthenticatedView';
import UnauthenticatedView from '../common/auth/UnauthenticatedView';
import { UserProfile } from '../../types/userProfile';
import { isValidEmail } from '../common/forms/validation';

// Minimal inline SVG icons — no extra dependency needed
const IconPerson = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const IconContact = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.06 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16z"/>
  </svg>
);

const IconImage = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21 15 16 10 5 21"/>
  </svg>
);

function UpdateUserProfile() {
  const [showEdit, setShowEdit] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const userProfileState = selector(state => state.userProfile.userProfile);
  const [profileDetails, setProfileDetails] = useState<UserProfile | null>(userProfileState);

  const showEditStyle = {
    borderBottom: showEdit ? "solid #D73F09 1px" : ""
  };

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
    if (profileDetails) {
      // Validate contact email before saving
      if (!profileDetails.contact?.email?.trim()) {
        setSaveError('Contact email is required.');
        return;
      }
      if (!isValidEmail(profileDetails.contact?.email)) {
        setSaveError('Please enter a valid email address.');
        return;
      }
      setSaveError(null);
      await userService.updateUserProfile(profileDetails.UID, profileDetails);
      dispatch(updateProfile(profileDetails));
      setShowEdit(false);
    }
  };

  const handleOpenDeleteDialog = () => setOpenDeleteDialog(true);
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleDeleteAccount = async () => {
    try {
      await userService.deleteUserProfile(userProfileState.UID);
      await authService.deleteUserAccount();
      window.location.href = "/";
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const deleteAccountDialog = (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to permanently delete your account? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
        <Button onClick={handleDeleteAccount} color="error" autoFocus>Delete</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <AuthenticatedView>
        <div className="user-profile-page">

          {/* ── Sticky action bar ── */}
          <div className="profile-action-bar">
            <h2>My Account</h2>
            {!showEdit
              ? <Button className="profile-edit-btn" onClick={() => setShowEdit(true)}>Edit Account</Button>
              : <Button className="profile-save-btn" onClick={saveChanges}>Save Changes</Button>
            }
          </div>

          {/* ── Save error message ── */}
          {saveError && (
            <p style={{ color: '#d32f2f', textAlign: 'center', margin: '0.5rem 0' }}>
              {saveError}
            </p>
          )}

          {profileDetails === null ? (
            <p className="profile-loading">Loading your profile…</p>
          ) : (
            <>
              {/* ── Profile Photo ── */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <span className="profile-section-icon"><IconImage /></span>
                  <h3>Account Profile Photo</h3>
                </div>
                <div className="profile-section-body no-scroll">
                  <UploadUserProfileImage userProfile={{ ...profileDetails, imageUrl: profileDetails?.imageUrl }} />
                </div>
              </div>

              {/* ── Personal Information ── */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <span className="profile-section-icon"><IconPerson /></span>
                  <h3>Personal Information</h3>
                </div>
                <div className="profile-section-body">
                  <UpdatePersonalInformation
                    showEdit={showEdit}
                    showEditStyle={showEditStyle}
                    userProfile={profileDetails}
                    onChange={setProfileDetails}
                  />
                </div>
              </div>

              {/* ── Contact Information ── */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <span className="profile-section-icon"><IconContact /></span>
                  <h3>Contact Information</h3>
                </div>
                <div className="profile-section-body">
                  <UpdateUserContactInformation
                    showEdit={showEdit}
                    showEditStyle={showEditStyle}
                    userProfile={profileDetails}
                    onChange={setProfileDetails}
                  />
                </div>
              </div>
            </>
          )}

          {/* ── Delete account ── */}
          <div className="delete-account-section">
            <button className="delete-account-link" onClick={() => setShowDeleteButton(true)}>
              Looking to delete your account?
            </button>
            {showDeleteButton && (
              <Button variant="outlined" color="error" onClick={handleOpenDeleteDialog}>
                Delete Account
              </Button>
            )}
          </div>

        </div>
        {deleteAccountDialog}
      </AuthenticatedView>
      <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
    </>
  );
}

export default UpdateUserProfile;

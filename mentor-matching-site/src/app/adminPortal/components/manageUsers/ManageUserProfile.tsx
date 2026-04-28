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
import '../../AdminPortal.css';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { MatchRole, AdminMatchRole } from "../../../../types/matchProfile";
import { isValidEmail } from '../../../common/forms/validation';


const adminFunctions = getFunctions();
const setAdminPrivileges = httpsCallable(adminFunctions, 'setAdminPrivileges');
const removeAdminPrivileges = httpsCallable(adminFunctions, 'removeAdminPrivileges');


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
    // track the initial role to detect changes on save
    const [initialRole, setInitialRole] = useState<string | null>(null);
    // Error message state for save validation
    const [saveError, setSaveError] = useState<string | null>(null);
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
                setInitialRole(profile?.preferences?.role || null); // Store original role
            }
        };
        getUserProfile();
    }, [userID]); // Rerun this if the userID changes-- which means the URL parameter changed.

    const saveChanges = async () => {
        if(profileDetails && userID) {

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

            try {
                const currentRole = profileDetails.preferences?.role;
                // Handle admin privilege changes in Firebase Auth
                if(initialRole !== currentRole) {
                    // non-admin -> admin
                    if(currentRole === AdminMatchRole.admin) {
                        await setAdminPrivileges({admin_uid: userID});
                        console.log("Admin privileges granted");
                    }
                    // admin -> non-admin
                    else if(initialRole === AdminMatchRole.admin) {
                        console.log("Admin privileges removal is being called");
                        await removeAdminPrivileges({admin_uid: userID});
                        console.log("Admin privileges removed");
                    }
                }

                // save the rest of the profile data to Firestore
                await userService.updateUserProfile(profileDetails.UID, profileDetails);

                // update initialRole so subsequent saves don't retrigger the function
                setInitialRole(currentRole);
                setShowEdit(false);
                alert("Profile updated successfully!");
                }
                catch (error) {
                    console.error("Error updating profile:", error);
                    alert("Failed to update roles. Do you have admin permissions?");
                }
        }
    };
        
    const dataIsLoading = () => {
    if (profileDetails === null) {
      return (<>Data is loading...</>);
    } else {
      return  (
        <FormGroup sx={{
          gap: '2rem',
          paddingTop: '2.5rem',
          paddingBottom: '4.5rem',
          maxWidth: '760px',
          width: '100%',
          margin: '0 auto',
          padding: '2rem 1.5rem',
          boxSizing: 'border-box'
        }}>
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
                <div className="manage-user-profile" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '0 1.5rem 4rem',
                  minHeight: '100vh',
                  boxSizing: 'border-box'
                }}>
                  <div style={{
                    width: '100%',
                    maxWidth: '760px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: '2px solid #D73F09',
                    marginBottom: '1rem'
                  }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600 }}>Edit User Profile</h2>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <Button onClick={handleMessagesClick}>View Messages</Button>
                      {!showEdit
                        ? <Button onClick={() => setShowEdit(true)}>Edit Profile</Button>
                        : <Button variant="contained" onClick={saveChanges} sx={{ backgroundColor: '#D73F09' }}>Save Profile</Button>
                      }
                    </div>
                  </div>

                  {/* Save error message */}
                  {saveError && (
                    <p style={{ color: '#d32f2f', textAlign: 'center', margin: '0.5rem 0' }}>
                      {saveError}
                    </p>
                  )}

                  <Menu
                    open={(Boolean(anchorElement))}
                    anchorEl={anchorElement}
                    anchorOrigin={{vertical: "bottom", horizontal: "center"}}
                    transformOrigin={{vertical: "top", horizontal: "center"}}
                    PaperProps={{
                      sx: {
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: "1rem",
                      }
                    }}
                    onClose={handleMessagesClose}
                  >
                    {profileDetails &&
                      <div style={{display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
                        <Messages userProfile={profileDetails} adminView={true} />
                      </div>
                    }
                  </Menu>
                  {dataIsLoading()}
                </div>
            </AuthenticatedView>
            <UnauthenticatedView onloadNavigate={true} navigateToRoute='/login' />
        </>
    )

}

export default ManageUserProfile;

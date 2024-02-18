import { Button, FormGroup } from "@mui/material";
import "./UserProfile.css";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { useState, useEffect } from "react";
import UploadUserProfileImage from "../userProfileCommon/imageUpload/UploadUserProfileImage";
import UpdatePersonalInformation from "./components/UpdatePersonalInformation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/userProfileReducer";
import UpdateUserContactInformation from "./components/UpdateUserContactInformation";
import UpdateUserDemographicInformation from "./components/UpdateDemographicsInformation";
import UpdateEducationInformation from "./components/UpdateEducationInformation";
import { doc, getDoc } from "@firebase/firestore";
import { db } from "../../firebaseConfig";
import { UserProfile } from '../../types/userProfile';

function UpdateUserProfile() {
  const [showEdit, setShowEdit] = useState(false);
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

        // Load the image URL from the database
        const userRef = doc(db, 'users', currentUser.uid); // Replace 'users' with actual collection name
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userProfile = userSnap.data() as UserProfile;
          dispatch(updateProfile(userProfile)); // Update the redux store
        }
      }
    };
    loadUserProfile();
  }, []);

  const saveChanges = async () => {
    await userService.updateUserProfile(userProfileState.UID, userProfileState);
    setShowEdit(!showEdit);
  }

  const dataIsLoading = () => {
    if (userProfileState === undefined) {
      return (<>Data is loading...</>)
    }
    else {
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
    </FormGroup>
  );

  return (
    <>{dataIsLoading()}</>
  );
}

export default UpdateUserProfile;
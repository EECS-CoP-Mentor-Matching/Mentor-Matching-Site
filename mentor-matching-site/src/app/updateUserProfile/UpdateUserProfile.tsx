import { Button } from "@mui/material";
import "./UserProfile.css";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { useState, useEffect } from "react";
import FormGroupCols from "../common/forms/FormGroupCols";
import UploadUserProfileImage from "./components/UploadUserProfileImage";
import UpdatePersonalInformation from "./components/UpdatePersonalInformation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/profileReducer";
import UpdateUserContactInformation from "./components/UpdateUserContactInformation";
import UpdateUserDemographicInformation from "./components/UpdateDemographicsInformation";

function UpdateUserProfile() {
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const userProfileState = selector(state => state.profile.userProfile);

  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser) {
        const profile = await userService.getUserProfile(currentUser.uid);
        dispatch(updateProfile(profile));
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
    <>
      <FormGroupCols>
        <UploadUserProfileImage userProfile={(userProfileState)} />
        <UpdatePersonalInformation showEdit={showEdit} />
        <UpdateUserContactInformation showEdit={showEdit} />
        <UpdateUserDemographicInformation showEdit={showEdit} />
        {!showEdit &&
          <Button onClick={() => { setShowEdit(!showEdit) }}>Edit Profile</Button>
        }
        {showEdit &&
          <Button onClick={saveChanges}>Save Profile</Button>
        }
      </FormGroupCols>
    </>

  );

  return (
    <div className="user-profile">
      {dataIsLoading()}
    </div>
  );
}

export default UpdateUserProfile;
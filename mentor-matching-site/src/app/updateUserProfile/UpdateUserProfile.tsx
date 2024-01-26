import { Button } from "@mui/material";
import "./UserProfile.css";
import authService from "../../service/authService";
import userService from "../../service/userService";
import { useState, useEffect } from "react";
import { UserProfile, initUserProfile } from "../../types/userProfile";
import FormGroupCols from "../common/forms/FormGroupCols";
import TextInputControl from "../common/forms/TextInputControl";
import FormGroupRows from "../common/forms/FormGroupRows";
import EditUserProfile from "./components/EditUserProfile";
import UpdatePersonalInformation from "./components/UpdatePersonalInformation";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { updateProfile } from "../../redux/reducers/profileReducer";

function UpdateUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile>(initUserProfile());
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useAppDispatch();
  const selector = useAppSelector;
  const profileState = selector(state => state.profile.userProfile);

  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser) {
        const profile = await userService.getUserProfile(currentUser.uid);
        setUserProfile(profile);
        dispatch(updateProfile(profile));
      }
    };
    loadUserProfile();
  }, []);

  const saveChanges = async () => {
    await userService.updateUserProfile(profileState.UID, profileState);
    setShowEdit(!showEdit);
  }

  const dataIsLoading = () => {
    if (userProfile === undefined) {
      return (<>Data is loading...</>)
    }
    else {
      return dataDisplay;
    }
  }

  const dataDisplay = (
    <>
      <FormGroupCols>
        <UpdatePersonalInformation showEdit={showEdit} />
        <FormGroupRows>
          <TextInputControl value={userProfile.contact.email} label="Email" readonly={!showEdit} />
          <TextInputControl value={userProfile.contact.displayName} label="Display Name" readonly={!showEdit} />
          <TextInputControl value={userProfile.contact.pronouns} label="Pronouns" readonly={!showEdit} />
          <TextInputControl value={userProfile.contact.timeZone} label="Time Zone" readonly={!showEdit} />
        </FormGroupRows>
        <FormGroupRows>
          <TextInputControl value={userProfile.demographics.lgbtqPlusCommunity ? 'Yes' : 'No'} label="Identify as LGBTQ+" readonly={!showEdit} />
          <TextInputControl value={userProfile.demographics.racialIdentity} label="Racial Identity" readonly={!showEdit} />
        </FormGroupRows>
        {!showEdit &&
          <Button onClick={() => { setShowEdit(!showEdit) }}>Edit Profile</Button>
        }
      </FormGroupCols>
      {showEdit && <>
        <EditUserProfile userProfile={(userProfile as UserProfile)} saveChanges={saveChanges} />
      </>}
    </>

  );

  return (
    <div className="user-profile">
      {dataIsLoading()}
    </div>
  );
}

export default UpdateUserProfile;
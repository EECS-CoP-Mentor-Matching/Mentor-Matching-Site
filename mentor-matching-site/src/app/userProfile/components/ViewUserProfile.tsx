import { InputLabel, Input, TextareaAutosize, FormLabel, Button } from "@mui/material";
import "../UserProfile.css";
import { useNavigate } from 'react-router-dom';
import authService from "../../../service/authService";
import userService from "../../../service/userService";
import { useState, useEffect } from "react";
import { UserProfile } from "../../../types";
import FormGroupCols from "../../common/forms/FormGroupCols";
import TextInputControl from "../../common/forms/TextInputControl";
import TextDisplay from "../../common/forms/TextDisplay";
import FormGroupRows from "../../common/forms/FormGroupRows";
import EditUserProfile from "./EditUserProfile";

function ViewUserProfile() {
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser) {
        const profile = await userService.getUserProfile(currentUser.uid);
        setUserProfile(profile);
      }
    };
    loadUserProfile();
  }, []);

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
        <FormGroupRows>
          <TextDisplay value={userProfile?.personal.firstName} label="First Name" />
          <TextDisplay value={userProfile?.personal.lastName} label="Last Name" />
        </FormGroupRows>
        <FormGroupRows>
          <TextDisplay value={userProfile?.contact.email} label="Email" />
          <TextDisplay value={userProfile?.contact.displayName} label="Display Name" />
          <TextDisplay value={userProfile?.contact.pronouns} label="Pronouns" />
          <TextDisplay value={userProfile?.contact.timeZone} label="Time Zone" />
        </FormGroupRows>
        <FormGroupRows>
          <TextDisplay value={userProfile?.demographics.lgbtqPlusCommunity ? 'Yes' : 'No'} label="Identify as LGBTQ+" />
          <TextDisplay value={userProfile?.demographics.racialIdentity} label="Racial Identity" />
        </FormGroupRows>
        <Button onClick={() => { setShowEdit(!showEdit) }}>Edit Profile</Button>
      </FormGroupCols>
      {showEdit && <>
        <EditUserProfile userProfile={(userProfile as UserProfile)} />
      </>}
    </>

  );

  return (
    <div className="user-profile">
      {dataIsLoading()}
    </div>
  );
}

export default ViewUserProfile;
import { InputLabel, Input, TextareaAutosize, FormLabel, Button } from "@mui/material";
import "./UserProfile.css";
import { useNavigate } from 'react-router-dom';
import authService from "../../service/authService";
import userService from "../../service/userService";
import { useState, useEffect } from "react";
import { UserProfile } from "../../types";
import FormGroupCols from "../common/FormGroupCols";
import TextInputControl from "../common/TextInputControl";
import TextDisplay from "../common/TextDisplay";
import FormGroupRows from "../common/FormGroupRows";

function ViewUserProfile() {
  // const email = "p.a.tasabia@gmail.com";
  // const displayName = "Philip T.";
  // const firstName = "Philip";
  // const lastName = "Tasabia";
  // const middleName = "Andrew";
  // const pronouns = "he/him";
  // const racialIdentity = "Hispanic";
  // const timeZone = "Eastern US";
  // const userBio = "Hi! My name is philip and I am a senior in the OSU Computer Science program."
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const navigate = useNavigate();

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

  return (
    <div className="user-profile">
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
        <Button onClick={() => navigate('/profile/edit')}>Edit Profile</Button>
      </FormGroupCols>
    </div>
  );
}

export default ViewUserProfile;
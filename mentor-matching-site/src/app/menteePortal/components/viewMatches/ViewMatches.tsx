import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import ContentContainer from "../../../common/ContentContainer";
import React, { useEffect, useState } from "react";
import authService from "../../../../service/authService";
import { mentorService } from "../../../../service/mentorService";
import userService from "../../../../service/userService";
import { DocItem, DropDownOption } from "../../../../types/types";
import { MatchProfile } from "../../../../types/matchProfile";
import DropDownControl from "../../../common/forms/dropDowns/DropDownControl";
import menteeService from "../../../../service/menteeService";
import { UserProfile } from "../../../../types/userProfile";
import TextDisplay from "../../../common/forms/textInputs/TextDisplay";
import { errorLogDb } from "../../../../dal/errorLogDb";
import LoadingMessage from "../../../common/forms/modals/LoadingMessage";
import SubmitButton from "../../../common/forms/SubmitButton";
import ModalWrapper from "../../../common/forms/modals/ModalWrapper";

interface MessageMentorState {
  showModal: boolean,
  selectedMentorId: string
}

function ViewMatches() {
  const [mentorProfiles, setMentorProfiles] = useState<DocItem<MatchProfile>[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<string>('');
  const [menteeProfiles, setMenteeProfiles] = useState<DocItem<MatchProfile>[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState(false);
  const [messageMentorPopup, setMessageMentorPopup] = useState<MessageMentorState>({ showModal: false, selectedMentorId: '' });

  useEffect(() => {
    const fetchMenteeProfiles = async () => {
      const currentUser = await authService.getSignedInUser();
      if (currentUser) {
        const profile = await userService.getUserProfile(currentUser.uid);
        setUserProfile(profile);

        const menteeProfileResults = await menteeService.searchMenteeProfilesByUser(currentUser.uid);
        setMenteeProfiles(menteeProfileResults);
      }
    }
    setLoading(true);
    fetchMenteeProfiles();
    setLoading(false);
  }, []);

  const profileItemStyle = {
    border: '1px solid #e0e0e0',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '4px',
    width: '80%',
    maxWidth: '700px',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const menteeDropDown = (): DropDownOption[] => {
    const options = new Array<DropDownOption>();
    menteeProfiles.forEach(result => {
      options.push({
        label: `${result.data.technicalInterest} and ${result.data.professionalInterest}`,
        id: result.docId
      } as DropDownOption);
    });
    return options;
  }

  const viewMenteeProfileMatches = async (profileId: string) => {
    setLoading(true);
    const currentUser = await authService.getSignedInUser();
    if (currentUser && userProfile) {
      try {
        const result = await mentorService.searchMentorsByProfileMatch(profileId, userProfile);
        setMentorProfiles(result);
      }
      catch (error) {
        console.log(error);
        errorLogDb.logError("ViewMatches", error);
      }
    }
    setSelectedProfile(profileId);
    setLoading(false);
  }

  return (
    <ContentContainer
      title="Active Profiles"
      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', rowGap: '25px' }}
    >
      <DropDownControl label="Mentee Profile"
        options={menteeDropDown()}
        onSelect={viewMenteeProfileMatches}
        valueIs="id"
        widthMulti={.50} />
      {selectedProfile !== undefined && selectedProfile !== '' && <>
        {mentorProfiles.length !== 0 &&
          <Box>
            <List>
              {mentorProfiles.map((profile, index) => (
                <React.Fragment key={profile.docId}>
                  <Paper elevation={2} style={profileItemStyle}>
                    <ListItem>
                      <ListItemText
                        primary={`Match #${index + 1}`}
                        secondary={
                          <p style={{ display: "flex", flexDirection: "column", minWidth: '400px' }}>
                            <span>Technical Interest: {profile.data.technicalInterest} ({profile.data.technicalExperience} years)</span>
                            <span>Professional Interest: {profile.data.professionalInterest} ({profile.data.professionalExperience} years)</span>
                          </p>
                        } />
                      <SubmitButton text="Message" onClick={() => { setMessageMentorPopup({ showModal: true, selectedMentorId: profile.docId }); }} />
                    </ListItem>
                    {index < mentorProfiles.length - 1 && <Divider />}
                  </Paper>
                  <ModalWrapper open={messageMentorPopup.showModal} setIsOpen={(isOpen) => {
                    setMessageMentorPopup({ showModal: isOpen, selectedMentorId: profile.docId });
                  }}>
                    <p>Type a message to send to your mentor match!</p>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                      <textarea style={{ height: '250px', width: '250px' }}>

                      </textarea>
                      <SubmitButton text="Send Message" />
                    </Box>
                  </ModalWrapper>
                </React.Fragment>
              ))}
            </List>
          </Box>
        }
        {(mentorProfiles.length === undefined || mentorProfiles.length === 0) &&
          <TextDisplay>No matches found</TextDisplay>
        }
      </>}
      <LoadingMessage message="Loading matches..." loading={loading} />
    </ContentContainer>
  );
}

export default ViewMatches;
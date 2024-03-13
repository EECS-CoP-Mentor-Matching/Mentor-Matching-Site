import { Box, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import React, { useState } from "react";
import { DocItem } from "../../../../../types/types";
import { MatchProfile } from "../../../../../types/matchProfile";
import TextDisplay from "../../../../common/forms/textInputs/TextDisplay";
import SubmitButton from "../../../../common/forms/buttons/SubmitButton";
import ModalWrapper from "../../../../common/forms/modals/ModalWrapper";

interface MessageMentorState {
  showModal: boolean,
  selectedMentorId: string
}

interface ViewMatchesProps {
  mentorProfiles: DocItem<MatchProfile>[]
}

function ViewMatches({ mentorProfiles }: ViewMatchesProps) {
  const [messageMentorPopup, setMessageMentorPopup] = useState<MessageMentorState>({ showModal: false, selectedMentorId: '' });

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

  return (
    <Box paddingTop={5}>
      {mentorProfiles.length !== 0 &&
        <List>
          {mentorProfiles.map((profile, index) => (
            <React.Fragment key={profile.docId}>
              <Paper elevation={2} style={profileItemStyle}>
                <ListItem>
                  <Box paddingRight={4}>
                    <ListItemText primary={`Match #${index + 1}`} />
                    <ListItemText secondary={"Technical Interest"} />
                    <Box gap={2} display="flex" alignItems="center" paddingLeft='15px' >
                      <Chip label={profile.data.technicalInterest} color="secondary" />
                      <Chip label={`${profile.data.technicalExperience} years`} variant="outlined" />
                    </Box>
                    <ListItemText secondary={"Professional Interest"} />
                    <Box gap={2} display="flex" alignItems="center" paddingLeft='15px' paddingBottom='10px'>
                      <Chip label={profile.data.professionalInterest} color="secondary" />
                      <Chip label={`${profile.data.professionalExperience} years`} variant="outlined" />
                    </Box>
                  </Box>
                  <SubmitButton text="Message" onClick={() => { setMessageMentorPopup({ showModal: true, selectedMentorId: profile.docId }); }} />
                </ListItem>
                {index < mentorProfiles.length - 1 && <Divider />}
              </Paper>
              <ModalWrapper open={messageMentorPopup.showModal} setIsOpen={(isOpen) => {
                setMessageMentorPopup({ showModal: isOpen, selectedMentorId: profile.docId });
              }}>
                <p>Type a message to send to your mentor match!</p>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                  <textarea style={{ height: '250px', width: '250px' }} />
                  <SubmitButton text="Send Message" />
                </Box>
              </ModalWrapper>
            </React.Fragment>
          ))}
        </List>
      }
      {(mentorProfiles.length === undefined || mentorProfiles.length === 0) &&
        <TextDisplay>No matches found</TextDisplay>
      }
    </Box>
  );
}

export default ViewMatches;
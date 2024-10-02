import { Box, Divider, ListItem, ListItemText, Paper } from "@mui/material";
import React, { useState } from "react";
import { DocItem } from "../../../../../types/types";
import { MentorReply, Message } from "../../../../../types/matchProfile";
import SubmitButton from "../../../../common/forms/buttons/SubmitButton";
import ModalWrapper from "../../../../common/forms/modals/ModalWrapper";
import { UserProfile } from "../../../../../types/userProfile";
import userService from "../../../../../service/userService";
import TextDisplay from "../../../../common/forms/textInputs/TextDisplay";

interface ViewMenteeMessageProps {
  message: DocItem<Message>
  index: number
  messagesLength: number
}

function ViewMenteeMessage({message, index, messagesLength}: ViewMenteeMessageProps) {
  const [isOpen, setisOpen] = useState(false);
  const [mentorProfile, setMentorProfile] = useState<UserProfile>();

  const getContactInfo = async () => {
    if (mentorProfile === undefined) {
      const userProfile = await userService.getUserProfile(message.data.mentorUID);
      setMentorProfile(userProfile);
    }
  }

  const openContactInfo = async () => {
    await getContactInfo();
    setisOpen(true);
  }

  const displayStyle = {
    margin: '10px 0',
    padding: '10px',
  }
  
  return (
    <React.Fragment key={message.docId}>
      <Paper elevation={2} style={{ ...displayStyle }}>
        <ListItem sx={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start', marginBottom: '15px' }}>
          <Box display='flex' flexDirection='column' alignItems='center' width='100%' justifyContent='flex-end'>
            <ListItemText primary={`Message #${index + 1}`} secondary={message.data.message} />
            {parseInt(message.data.mentorReply) === MentorReply.accepted &&
              <>
              <ListItemText secondary={"The mentor accepted your request! Click the button to view their contact info."} />
              <SubmitButton onClick={openContactInfo} text="Contact Info"/>
              <ModalWrapper setIsOpen={setisOpen} open={isOpen} >
                <Box display={"flex"} flexDirection={"column"}>
                  <TextDisplay>Display Name: {mentorProfile?.contact.displayName}</TextDisplay>
                  <TextDisplay widthMulti={.25}>Email: {mentorProfile?.contact.email}</TextDisplay>
                  <TextDisplay>Pronouns: {mentorProfile?.contact.pronouns}</TextDisplay>
                  <TextDisplay>Time Zone: {mentorProfile?.contact.timeZone}</TextDisplay>
                  <TextDisplay>User Bio: {mentorProfile?.contact.userBio}</TextDisplay>
                </Box>
              </ModalWrapper>
              </>
            }
            {parseInt(message.data.mentorReply) === MentorReply.awaiting &&
              <ListItemText primary={'awaiting reply from mentor'} />
            }
          </Box>
        </ListItem>
        {index < messagesLength - 1 && <Divider />}
      </Paper>
    </React.Fragment>
  );
}

export default ViewMenteeMessage;
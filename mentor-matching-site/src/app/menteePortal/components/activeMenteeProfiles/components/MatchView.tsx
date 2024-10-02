import { MatchProfileView, MentorReply, Message, MessageState } from "../../../../../types/matchProfile";
import { Box, Chip, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import React, { useState } from "react";
import SubmitButton from "../../../../common/forms/buttons/SubmitButton";
import ModalWrapper from "../../../../common/forms/modals/ModalWrapper";
import { messagingService } from "../../../../../service/messagingService";
import { Timestamp } from "firebase/firestore";
import ReportUser from "../../../../reportUser/ReportUser";

interface MessageMentorState {
  showModal: boolean,
  selectedMentorId: string,
  messageState: MessageState
}

interface MatchViewProps {
  profile: MatchProfileView
  menteeUID: string
  menteeProfileId: string
  index: number
  profileCount: number
  onReport: (reportedForUID: string) => void
}

function MatchView({ profile, menteeUID, menteeProfileId, index, profileCount, onReport }: MatchViewProps) {
  const [messageMentorPopup, setMessageMentorPopup] = useState<MessageMentorState>({ showModal: false, selectedMentorId: '', messageState: MessageState.noMessagesSent });
  const [message, setMessage] = useState("");

  const getMessageButtonText = (state: MessageState): string => {
    if (state === MessageState.awaitingReply) {
      return "Message Sent"
    }
    else if (state === MessageState.noMessagesSent) {
      return "Message"
    }
    else if (state === MessageState.replyReceived) {
      return "Reply Recieved!"
    }
    return "Message"
  }

  const profileItemStyle = {
    border: '1px solid #e0e0e0',
    margin: '10px 0',
    padding: '10px',
    borderRadius: '4px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
  };

  const sendMessage = async (mentorUID: string, mentorProfileId: string) => {
    const newMessage = {
      sentByUID: menteeUID,
      menteeUID: menteeUID,
      menteeProfileId: menteeProfileId,
      mentorUID: mentorUID,
      mentorProfileId: mentorProfileId,
      message: message,
      mentorReply: MentorReply.awaiting.toString(),
      technicalInterest: profile.mentorProfile.data.technicalInterest,
      professionalInterest: profile.mentorProfile.data.professionalInterest,
      sentOn: Timestamp.now(),
    } as Message;
    await messagingService.sendMessage(newMessage);
    setMessageMentorPopup({ showModal: false, selectedMentorId: mentorProfileId, messageState: MessageState.awaitingReply });
    profile.messageState = MessageState.awaitingReply;
  }

  return (
    <React.Fragment key={profile.mentorProfile.docId}>
      <Paper elevation={2} style={profileItemStyle}>
        <ListItem>
          <Box paddingRight={4}>
            <Box display={'flex'} flexDirection={'row'} justifyContent={'space-between'}>
              <ListItemText primary={`Match #${index + 1}`} />
              <ReportUser onReport={onReport} reportedForUID={profile.mentorProfile.data.UID} />
            </Box>
            <ListItemText secondary={"Technical Interest"} />
            <Box gap={2} display="flex" alignItems="center" paddingLeft='15px' >
              <Chip label={profile.mentorProfile.data.technicalInterest} color="secondary" />
              <Chip label={`${profile.mentorProfile.data.technicalExperience} years`} variant="outlined" />
            </Box>
            <ListItemText secondary={"Professional Interest"} />
            <Box gap={2} display="flex" alignItems="center" paddingLeft='15px' paddingBottom='10px'>
              <Chip label={profile.mentorProfile.data.professionalInterest} color="secondary" />
              <Chip label={`${profile.mentorProfile.data.professionalExperience} years`} variant="outlined" />
            </Box>
          </Box>
          <Box display='flex' flexDirection='column' gap='10px' alignItems={'flex-end'} justifyContent={'flex-start'}>
            <SubmitButton text={getMessageButtonText(profile.messageState)}
              onClick={() => {
                setMessageMentorPopup({ showModal: true, selectedMentorId: profile.mentorProfile.docId, messageState: profile.messageState })
              }} />
          </Box>
        </ListItem>
        {index < profileCount - 1 && <Divider />}
      </Paper>
      <ModalWrapper open={messageMentorPopup.showModal} setIsOpen={(isOpen) => {
        setMessageMentorPopup({ showModal: isOpen, selectedMentorId: profile.mentorProfile.docId, messageState: profile.messageState })
      }}>
        <>
          {profile.messageState === MessageState.noMessagesSent && <>
            <p>Type a message to send to your mentor match!</p>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
              <textarea style={{ height: '250px', width: '250px' }} onChange={(e) => { setMessage(e.target.value) }} />
              <SubmitButton text="Send Message" onClick={() => sendMessage(profile.mentorProfile.data.UID, profile.mentorProfile.docId)} />
            </Box>
          </>}
          {profile.messageState === MessageState.awaitingReply && <>
            <p>Awaiting reply from mentor....</p>
          </>}
          {profile.messageState === MessageState.replyReceived && <>
            <p>Awaiting reply from mentor....</p>
          </>}
        </>
      </ModalWrapper>
    </React.Fragment>
  );
}

export default MatchView;
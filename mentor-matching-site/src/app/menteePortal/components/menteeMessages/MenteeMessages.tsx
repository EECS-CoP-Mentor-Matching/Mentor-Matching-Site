import React, { useEffect, useState } from "react";
import ContentContainer from "../../../common/ContentContainer";
import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";
import ViewMenteeMessage from "./components/ViewMenteeMessage";

interface MenteeMessagesProps {
  backToPage: () => void,
  userId: string
}

function MenteeMessages({ backToPage, userId }: MenteeMessagesProps) {
  // State variable for received mentee messages:
  const [menteeMessagesInbound, setMenteeMessagesInbound] = useState<DocItem<Message>[]>([]);
  // State variable for messages sent by mentee
  const [menteeMessagesSent, setMenteeMessagesSent] = useState<DocItem<Message>[]>([]);
  const selector = useAppSelector;
  //const menteeUID = selector(state => state.userProfile.userProfile.UID);

  // Get messages addressed to this mentee
  useEffect(() => {
    const getMessagesInbound = async () => {
      const messages = await messagingService.getMessagesSentToMentee(userId);
      if (messages.length === 0) {
        console.log("No inbound messages yet");
      }
      setMenteeMessagesInbound(messages);
    }
    // Get messages sent by this mentee:
    const getMessagesSent = async () => {
      const messages = await messagingService.getMessagesSentByMentee(userId);
      if (messages.length === 0) {
        console.log("No messages yet")
        // If there are no messages, the below line executes and returns us to the previous page.  Commenting it out lets us see the Messages screen:
        //backToPage();
      }
      setMenteeMessagesSent(messages);
    }
    getMessagesInbound();
    getMessagesSent();
  }, [setMenteeMessagesInbound, setMenteeMessagesSent])

  // This currently only shows messages addressed to this user.  TODO: Show sent messages separately.
  return (
    <ContentContainer title="Messages">
      {menteeMessagesInbound.length > 0 &&
        <Box>
          <List>
            {menteeMessagesInbound.map((message, index) => (
              <ViewMenteeMessage message={message} index={index} messagesLength={menteeMessagesInbound.length}/>
            ))}
          </List>
        </Box>
      }
      {menteeMessagesInbound.length === 0 &&
        <Box>
          <div>No messages received...</div>
        </Box>
      }
      <a href="/send-message">Send New Message</a>
    </ContentContainer>
  );
}

export default MenteeMessages;
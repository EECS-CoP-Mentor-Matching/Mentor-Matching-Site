import React, { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { messagingService } from "../../../service/messagingService";
import { useAppSelector } from "../../../redux/hooks";
import { DocItem } from "../../../types/types";
import { Message } from "../../../types/matchProfile";
import ViewMessage from "./ViewMessage";
import { UserProfile } from "../../../types/userProfile";

interface MessagesProps {
  backToPage: () => void,
  userProfile: UserProfile
}

function Messages({ backToPage, userProfile }: MessagesProps) {
  // State variable for received messages:
  const [messagesInbound, setMessagesInbound] = useState<DocItem<Message>[]>([]);
  // State variable for messages sent by user
  const [messagesSent, setMessagesSent] = useState<DocItem<Message>[]>([]);

  // Check which type of user we are looking at:
  let fetchMessages = null;
  if (userProfile.preferences.role == "Mentee")
  {
    fetchMessages = messagingService.getMessagesSentToMentee;
  }
  else if (userProfile.preferences.role == "Mentor")
  {
    fetchMessages = messagingService.getMessagesSentToMentor;
  }

  // Get messages addressed to this user
  useEffect(() => {
    const getMessagesInbound = async () => {
      const messages = await messagingService.getMessagesSentToMentee(userProfile.UID);
      if (messages.length === 0) {
        console.log("No inbound messages yet");
      }
      setMessagesInbound(messages);
    }
    // Get messages sent by this user:
    const getMessagesSent = async () => {
      const messages = await messagingService.getMessagesSentByMentee(userProfile.UID);
      if (messages.length === 0) {
        console.log("No messages yet")
        // If there are no messages, the below line executes and returns us to the previous page.  Commenting it out lets us see the Messages screen:
        //backToPage();
      }
      setMessagesSent(messages);
    }
    getMessagesInbound();
    getMessagesSent();
  }, [setMessagesInbound, setMessagesSent])

  // This currently only shows messages addressed to this user.  TODO: Show sent messages separately.
  return (
    <ContentContainer title="Messages">
      {messagesInbound.length > 0 &&
        <Box>
          <List>
            {messagesInbound.map((message, index) => (
              <ViewMessage message={message} index={index} messagesLength={messagesInbound.length}/>
            ))}
          </List>
        </Box>
      }
      {messagesInbound.length === 0 &&
        <Box>
          <div>No messages received...</div>
        </Box>
      }
      <a href="/send-message">Send New Message</a>
    </ContentContainer>
  );
}

export default Messages;
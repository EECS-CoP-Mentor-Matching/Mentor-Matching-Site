import React, { useEffect, useState } from "react";
import ContentContainer from "../../../common/ContentContainer";
import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";
import ViewMenteeMessage from "./components/ViewMenteeMessage";

interface MenteeMessagesProps {
  backToPage: () => void
}

function MenteeMessages({ backToPage }: MenteeMessagesProps) {
  const [menteeMessages, setMenteeMessages] = useState<DocItem<Message>[]>([]);
  const selector = useAppSelector;
  const menteeUID = selector(state => state.userProfile.userProfile.UID);

  useEffect(() => {
    const getMessages = async () => {
      const messages = await messagingService.getMessagesSentByMentee(menteeUID);
      if (messages.length === 0) {
        backToPage();
      }
      setMenteeMessages(messages);
    }
    getMessages();
  }, [setMenteeMessages])

  

  return (
    <ContentContainer title="Messages">
      {menteeMessages.length > 0 &&
        <Box>
          <List>
            {menteeMessages.map((message, index) => (
              <ViewMenteeMessage message={message} index={index} messagesLength={menteeMessages.length}/>
            ))}
          </List>
        </Box>
      }
      {menteeMessages.length === 0 &&
        <Box>
          <div>No messages sent...</div>
        </Box>
      }
    </ContentContainer>
  );
}

export default MenteeMessages;
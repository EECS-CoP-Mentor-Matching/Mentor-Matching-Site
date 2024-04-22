import React, { useEffect, useState } from "react";
import ContentContainer from "../../../common/ContentContainer";
import { Box, Divider, List, ListItem, ListItemText, Paper } from "@mui/material";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";

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

  const displayStyle = {}

  return (
    <ContentContainer title="Messages">
      {menteeMessages.length > 0 &&
        <Box>
          <List>
            {menteeMessages.map((message, index) => (
              <React.Fragment key={message.docId}>
                <Paper elevation={2} style={{ ...displayStyle }}>
                  <ListItem sx={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'flex-start' }}>
                    <Box display='flex' flexDirection='column' alignItems='center' width='100%' justifyContent='flex-end'>
                      <ListItemText primary={`Message #${index + 1}`} secondary={message.data.message} />
                      <ListItemText primary={'awaiting reply from mentor'} />
                    </Box>
                  </ListItem>
                  {index < menteeMessages.length - 1 && <Divider />}
                </Paper>
              </React.Fragment>
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
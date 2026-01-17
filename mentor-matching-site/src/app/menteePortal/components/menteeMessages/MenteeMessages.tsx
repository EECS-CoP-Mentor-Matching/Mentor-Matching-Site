import React, { useEffect, useState } from "react";
import ContentContainer from "../../../common/ContentContainer";
import { Box, List } from "@mui/material";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";
import ViewMenteeMessage from "./components/ViewMenteeMessage";

interface MenteeMessagesProps {
  backToPage: () => void
}

function MenteeMessages({ backToPage }: MenteeMessagesProps) {
  const [menteeMessagesSent, setMenteeMessagesSent] = useState<DocItem<Message>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 1. Get the profile
  const userProfile = useAppSelector(state => state.userProfile.userProfile);
  
  // 2. LOG THE PROFILE TO SEE THE EXACT KEY NAME
  console.log("MENTEE MESSAGES CHECK - Profile:", userProfile);

  // Get messages sent by this mentee:
  useEffect(() => {
    const getMessagesSent = async () => {
      // Try both uppercase and lowercase just in case
      const menteeUID = userProfile?.UID || (userProfile as any)?.uid || (userProfile as any)?.id;

      if (!menteeUID) {
        console.log("MENTEE MESSAGES: No UID found yet...");
        return;
      }

      setIsLoading(true);
      try {
        console.log("MENTEE MESSAGES: Querying for ID:", menteeUID);
        const messages = await messagingService.getMessagesSentByMentee(menteeUID);
        setMenteeMessagesSent(messages);
      } catch (error) {
        console.error("MENTEE MESSAGES: Query Failed", error);
      } finally {
        setIsLoading(false);
      }
    };

    getMessagesSent();
  }, [userProfile]); // Watch the whole profile for changes

  return (
    <ContentContainer title="Messages">
      {isLoading ? (
        <Box>Loading messages...</Box>
      ) : menteeMessagesSent.length > 0 ? (
        <Box>
          <List>
            {menteeMessagesSent.map((message, index) => (
              <ViewMenteeMessage 
                key={index}
                message={message} 
                index={index} 
                messagesLength={menteeMessagesSent.length}
              />
            ))}
          </List>
        </Box>
      ) : (
        <Box>
          <div>No messages received...</div>
        </Box>
      )}
    </ContentContainer>
  );
}

export default MenteeMessages;
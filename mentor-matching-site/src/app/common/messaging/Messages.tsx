import React, { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { messagingService } from "../../../service/messagingService";
import { useAppSelector } from "../../../redux/hooks";
import { DocItem } from "../../../types/types";
import { Message } from "../../../types/matchProfile";
import ViewMessage from "./ViewMessage";
import { UserProfile } from "../../../types/userProfile";

interface MessagesProps {
  //backToPage: () => void,
  userProfile: UserProfile,
  adminView: Boolean // If the user is an admin requesting to see this users' messages, then return a lighter version with components they don't need removed.
}

function Messages({ /*backToPage,*/ userProfile, adminView }: MessagesProps) {
  // State variable for received messages:
  const [messagesInbound, setMessagesInbound] = useState<DocItem<Message>[]>([]);
  // State variable for messages sent by user
  const [messagesSent, setMessagesSent] = useState<DocItem<Message>[]>([]);
  // Track if we should show the delete dialog below or not:
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  // Function to open the delete dialog
  const handleOpenDeleteDialog = (messageId: string) => {
    setMessageToDelete(messageId);
    setOpenDeleteDialog(true);
  };

  // Function to close the delete dialog
  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  // Finally, handle deleting the message:
  async function handleDeleteMessage() {
    if (messageToDelete) {
      await messagingService.deleteMessage(messageToDelete);
      // Refresh the list of messages:
      setMessagesInbound(await fetchMessages(userProfile.UID))
    }
    else {
      alert("An error occured while deleting your message.  Please refresh the site and try again.");
    }
    
    // Regardless of the outcome, we should reset the state variable messageToDelete for hygiene purposes and then close out the dialog.
    setMessageToDelete(null);
    handleCloseDeleteDialog();
  }


  // Function to display a confirmation dialog before deleting a message:
  const deleteMessageDialog = (
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Message"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to permanently delete this message? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDeleteMessage} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );



  // Check which type of user we are looking at:
  let fetchMessages: ((arg0: string) => any);
  if (userProfile.preferences.role == "Mentee")
  {
    fetchMessages = messagingService.getMessagesSentToMentee;
  }
  else if (userProfile.preferences.role == "Mentor")
  {
    fetchMessages = messagingService.getMessagesSentToMentor;
  }
  // Just for debugging purposes!  We probably do not want Admins to see each others messages, but this will allow us to test the admin functions on our own accounts for now:
  else if (userProfile.preferences.role == "Admin")
  {
    fetchMessages = messagingService.getMessagesSentToMentee;
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
      {deleteMessageDialog}
      {messagesInbound.length > 0 &&
        <Box>
          <List>
            {messagesInbound.map((message, index) => (
              <span>
                <IconButton style={{float:"right"}} onClick={() => handleOpenDeleteDialog(message.docId)}>
                  <DeleteIcon />
                </IconButton>
                <ViewMessage message={message} index={index} messagesLength={messagesInbound.length}/>
              </span>
            ))}
            
          </List>
        </Box>
      }
      {messagesInbound.length === 0 &&
        <Box>
          <div>No messages received...</div>
        </Box>
      }
      {!adminView &&
        <a href="/send-message">Send New Message</a>
      }
    </ContentContainer>
  );
}

export default Messages;
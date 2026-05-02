import React, { useEffect, useState } from "react";
import ContentContainer from "../ContentContainer";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, IconButton, List, ListItem, ListItemText, Paper, TextField } from "@mui/material";
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
  // State variable for user's search terms
  const [searchTerms, setSearchTerms] = useState<string | null>(null);

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
      setMessagesInbound(await messagingService.getMessagesSentToUser(userProfile.UID))
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

  // Function to set and update the search terms:
  function changeSearchHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setSearchTerms(e.target.value as string)
  }

  // Get messages addressed to this user
  useEffect(() => {
    const getMessagesInbound = async () => {
      const messages = await messagingService.getMessagesSentToUser(userProfile.UID);
      if (messages.length === 0) {
        console.log("No inbound messages yet");
      }
      setMessagesInbound(messages);
    }
    // Get messages sent by this user:
    const getMessagesSent = async () => {
      const messages = await messagingService.getMessagesSentByUser(userProfile.UID);
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
      <Box sx={{ maxWidth: { xs: '100%', sm: '720px', md: '800px' }, margin: '0 auto', width: '100%' }}>
      {messagesInbound.length > 0 &&
        <Box>
          <TextField 
            type="search"
            id="searchFilter"
            label="Search Messages"
            name="searchFilter"
            value={searchTerms || ""}
            onChange={changeSearchHandler}
          />
          <List>
            {messagesInbound.map((message, index) => (
              <span>
                {/* Check for search terms: if none, or if the message matches them, display the message: */}
                {(!searchTerms || message.data.message.indexOf(searchTerms) != -1 || message.data.senderDisplayName.indexOf(searchTerms) != -1) && 
                <>
                  <IconButton style={{float:"right"}} onClick={() => handleOpenDeleteDialog(message.docId)}>
                    <DeleteIcon />
                  </IconButton>
                  <ViewMessage message={message} index={index} messagesLength={messagesInbound.length}/>
                </>
                }
              </span>     
            ))}
            
          </List>
        </Box>
      }
      {messagesInbound.length === 0 &&
        <Box>
          <div>No messages...</div>
        </Box>
      }
      {!adminView &&
        <div>
          <Button variant="outlined" href="/send-message">Send New Message</Button>
        </div>
      }
      </Box>
    </ContentContainer>
  );
}

export default Messages;

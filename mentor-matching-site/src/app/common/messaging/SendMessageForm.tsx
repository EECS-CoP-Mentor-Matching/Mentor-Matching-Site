import React, { useEffect, useState } from "react";
import { messagingService } from "../../../service/messagingService";
import { useAppSelector } from "../../../redux/hooks";
import ContentContainer from "../ContentContainer";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../../../types/userProfile";
import userService from '../../../service/userService';
import { MentorReply, Message } from "../../../types/matchProfile";
import { Timestamp } from "firebase/firestore";
import { TextField, MenuItem, Select, SelectChangeEvent, InputLabel, FormControl, Button } from "@mui/material";



function SendMessageForm() {

    // A useNavigate object allows us to move the user to another page.  We'll use this later when they click the button:
    const redirectToSite = useNavigate();

    // Initialize state to hold the message details
    const [messageDetails, setMessageDetails] = useState({
        recipient: "",
        message: ""
    });

    // State to hold error message text, if any.  Will be displayed to the user to alert them of errors on the form.
    const [errorMessageText, setErrorMessageText] = useState("");
    
    // Get the current user's profile
    const userProfile = useAppSelector((state) => state.userProfile.userProfile);

    // State and function for a list of all users in the database.  TODO: Later, we may want to filter this to only users matched to this one.
    const [usersList, setUsersList] = useState<UserProfile[]>([]);


    // Fetch a list of all users once on page load.  TODO: Add a filter so that only matched mentors are shown as an option.
    useEffect(() => {
            async function fetchUsers() {
                try {
                    setUsersList(await userService.getAllUserProfiles());
                }
                catch (error) {
                    console.log("Error getting recipient list: " + error)
                }
            };
            fetchUsers();
    }, []);

    

    // Create a Message object based on the user's input and send the message
    function sendMessageHandler(e: React.FormEvent) {
        e.preventDefault();
        // Check for no value in recipient or message:
        if (messageDetails.recipient == "") {
            setErrorMessageText("Please choose a recipient");
            return;
        }
        else if (messageDetails.message == "") {
            setErrorMessageText("Please enter a message");
            return;
        }

        let message: Message = {
            senderUID: userProfile.UID,
            senderProfileId: "",
            senderDisplayName: userProfile.contact.displayName,
            recipientUID: messageDetails.recipient,
            recipientProfileId: "",
            message: messageDetails.message,
            mentorReply: MentorReply.not_applicable.toString(),
            technicalInterest: "",
            professionalInterest: "",
            sentByUID: userProfile?.UID,
            sentOn: Timestamp.now()
        };

        messagingService.sendMessage(message);
        alert("Message sent!")
        redirectToSite("/mentee-portal");
        
    }

    // Update state whenever the user types in the boxes:
    function changeMessageHandler(e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement> | SelectChangeEvent<string>) {
        const inputName = e.target.name as string;
        const inputValue = e.target.value as string;

        setMessageDetails(values => ({...values, [inputName]: inputValue}))
    }

    return (
        <ContentContainer>
            <form onSubmit={sendMessageHandler} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h2>
                    Send a message to your contacts using the form below: <br />
                </h2>
                <FormControl fullWidth sx={{maxWidth: "700px", mt: 2}}>
                    <InputLabel id="nameLabel">Recipient's Name:</InputLabel>
                    <Select
                        id="recipient"
                        name="recipient"
                        label="Select Name"
                        labelId="nameLabel"
                        value={messageDetails.recipient}
                        onChange={changeMessageHandler}
                        inputProps={{name: "recipient"}}
                    >
                        { // Create the select dropdown list from our usersList; mapping each user to a dropdown selection.
                            usersList.map((user) => (<MenuItem key={user.UID} value={user.UID}>{user.contact.displayName}</MenuItem>))
                        }
                    </Select>
                </FormControl>

                    <TextField 
                        fullWidth
                        multiline
                        minRows={8}
                        id="message"
                        label="Your Message"
                        name="message"
                        onChange={changeMessageHandler} 
                        sx={{
                            mt: 3,
                            width: "100%",
                            maxWidth: "700px",
                            "& .MuiInputBase-input": {
                                resize: "both",
                                overflow: "auto"
                            }
                        }}
                    />
                <Button type="submit" variant="contained" sx={{mt: 3}}>Send Message</Button>
            </form>
            {/*Check for an error message, and if found, display it:*/}
            {errorMessageText && (
                <div style={{ color: "red", marginTop: "1rem" }}>
                    {errorMessageText}
                </div>
            )}

        </ContentContainer>
    );
}

export default SendMessageForm;
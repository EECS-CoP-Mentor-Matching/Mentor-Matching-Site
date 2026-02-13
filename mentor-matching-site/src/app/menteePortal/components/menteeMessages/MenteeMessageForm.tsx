import React, { useEffect, useState } from "react";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import ContentContainer from "../../../common/ContentContainer";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "../../../../types/userProfile";
import userService from '../../../../service/userService';



function MenteeMessageForm() {

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
        console.log("Send message button pressed\n" + messageDetails.recipient + "\n" + messageDetails.message);
        // Check for no value in recipient or message:
        if (messageDetails.recipient == "") {
            setErrorMessageText("Please choose a recipient");
            return;
        }
        else if (messageDetails.message == "") {
            setErrorMessageText("Please enter a message");
            return;
        }

        let message = {
            menteeUID: messageDetails.recipient,
            menteeProfileId: "DEBUG",
            mentorUID: "DEBUG",
            mentorProfileId: "DEBUG",
            message: messageDetails.message,
            mentorReply: "0",
            technicalInterest: "DEBUG",
            professionalInterest: "DEBUG",
            sentByUID: userProfile?.UID,
            sentOn: 0
        };

        messagingService.sendMessage(message);
        alert("Message sent!")
        redirectToSite("/mentee-portal");
        
    }

    // Update state whenever the user types in the boxes:
    function changeMessageHandler(e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
) {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        setMessageDetails(values => ({...values, [inputName]: inputValue}))
    }

    return (
        <ContentContainer>
            <form>
                <h2>
                    Send a message to your contacts using the form below: <br />
                </h2>
                <label>
                    Recipient's Name:
                    <select
                        name="recipient"
                        value={messageDetails.recipient}
                        onChange={changeMessageHandler}
                        required
                    >
                    <option value="" disabled hidden>Choose a Recipient</option>
                    { // Create the select dropdown list from our usersList; mapping each user to a dropdown selection.
                        usersList.map(user => <option value={user.UID}>{user.contact.displayName}</option>)
                    }
                    </select>
                </label>
                <br />
                <label>
                    Your Message:
                    <textarea
                        name="message"
                        value={messageDetails.message}
                        onChange={changeMessageHandler}
                    />
                </label>
                <input type="submit" onClick={sendMessageHandler} value="Send Message"/>
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

export default MenteeMessageForm;
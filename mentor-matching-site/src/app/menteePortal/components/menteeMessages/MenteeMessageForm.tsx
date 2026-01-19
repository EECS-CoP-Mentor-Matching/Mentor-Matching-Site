import React, { useEffect, useState } from "react";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";
import ContentContainer from "../../../common/ContentContainer";
import { useNavigate } from "react-router-dom";

function MenteeMessageForm() {

    // A useNavigate object allows us to move the user to another page.  We'll use this later when they click the button:
    const redirectToSite = useNavigate();

    // Get the current user's profile
    const userProfile = useAppSelector((state) => state.userProfile.userProfile);

    // Initialize state to hold the message details
    const [messageDetails, setMessageDetails] = useState({
        recipient: "",
        message: ""
    });

    // Create a Message object based on the user's input and send the message
    function sendMessageHandler(e: any) {
        e.preventDefault();
        console.log("Send message button pressed\n" + messageDetails.recipient + "\n" + messageDetails.message);
        let message = {
            menteeUID: messageDetails.recipient,
            menteeProfileId: "DEBUG",
            mentorUID: "DEBUG",
            mentorProfileId: "DEBUG",
            message: messageDetails.message,
            mentorReply: "1",
            technicalInterest: "DEBUG",
            professionalInterest: "DEBUG",
            sentByUID: userProfile?.UID,
            sentOn: 0
        }
        messagingService.sendMessage(message);
        redirectToSite("/mentee-portal");
    }

    // Update state whenever the user types in the boxes:
    function changeMessageHandler(e: any) {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        setMessageDetails(values => ({...values, [inputName]: inputValue}))
    }

    return (
        <ContentContainer>
            <form>
                <h2>
                    DEBUG! Use these IDs in place of the user name for now.  This is just for testing the send/receive functions for now. <br />
                    Charles: vSXEbCikuXO6kzSqI22Dmm27Lbh1<br />
                    Andrew: LsWSk3HnDJPIuKElzd7u0zw4LYj2<br />
                    Aimee: iqB5Og7bTwSYhdnKRMNjNRQc6RC3<br />
                </h2>
                <label>
                    Recipient's Name:
                    <input
                        type="text"
                        name="recipient"
                        value={messageDetails.recipient}
                        onChange={changeMessageHandler}
                        required
                    />
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
        </ContentContainer>
    );
}

export default MenteeMessageForm;
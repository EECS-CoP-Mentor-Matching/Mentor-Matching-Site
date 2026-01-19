import React, { useEffect, useState } from "react";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";
import ContentContainer from "../../../common/ContentContainer";

function MenteeMessageForm() {

    const [messageDetails, setMessageDetails] = useState({
        recipient: "",
        message: ""
    });

    function sendMessageHandler(e: any) {
        e.preventDefault();
        console.log("Send message button pressed\n" + messageDetails.recipient + "\n" + messageDetails.message);
        let message = {
            menteeUID: messageDetails.recipient,
            menteeProfileId: "vSXEbCikuXO6kzSqI22Dmm27Lbh1",
            mentorUID: "vSXEbCikuXO6kzSqI22Dmm27Lbh1",
            mentorProfileId: "vSXEbCikuXO6kzSqI22Dmm27Lbh1",
            message: messageDetails.message,
            mentorReply: "vSXEbCikuXO6kzSqI22Dmm27Lbh1",
            technicalInterest: "Debug",
            professionalInterest: "Debug",
            sentByUID: "vSXEbCikuXO6kzSqI22Dmm27Lbh1",
            sentOn: 0
        }
        messagingService.sendMessage(message);
    }

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
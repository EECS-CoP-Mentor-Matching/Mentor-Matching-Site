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
        console.log("Send message button pressed\n" + messageDetails.recipient + "\n" + messageDetails.message)
    }

    function changeMessageHandler(e: any) {
        const inputName = e.target.name;
        const inputValue = e.target.value;

        setMessageDetails(values => ({...values, [inputName]: inputValue}))
    }

    return (
        <ContentContainer>
            <form>
                <label>
                    Recipient's Name:
                    <input
                        type="text"
                        name="recipient"
                        value={messageDetails.recipient}
                        onChange={changeMessageHandler}
                    />
                </label>
                <label>
                    Your Message:
                    <input
                        type="text"
                        name="message"
                        value={messageDetails.message}
                        onChange={changeMessageHandler}
                    />
                </label>
                <input type="submit" onClick={sendMessageHandler} />
            </form>
        </ContentContainer>
    );
}

export default MenteeMessageForm;
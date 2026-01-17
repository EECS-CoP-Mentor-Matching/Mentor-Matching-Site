import React, { useEffect, useState } from "react";
import { messagingService } from "../../../../service/messagingService";
import { useAppSelector } from "../../../../redux/hooks";
import { DocItem } from "../../../../types/types";
import { Message } from "../../../../types/matchProfile";
import ContentContainer from "../../../common/ContentContainer";

function SendMessageHandler(e: any) {
    e.preventDefault();
    console.log("Send message button pressed")
}


function MenteeMessageForm() {


    return (
        <ContentContainer>
            <form>
                <label>
                    Recipient's Name:
                </label>
                <input
                    type="text"
                    name="recipient"
                />
                <button type="submit" onClick={SendMessageHandler}></button>
            </form>
        </ContentContainer>
    );
}

export default MenteeMessageForm;
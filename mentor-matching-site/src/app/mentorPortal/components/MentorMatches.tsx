import React, {useEffect, useState} from 'react';
import ContentContainer from "../../common/ContentContainer";
import {Box, Grid} from "@mui/material";
import authService from "../../../service/authService";
import {DocItem} from '../../../types/types';
import MessageCard from "./MessageCard";
import {MentorReply, Message} from "../../../types/matchProfile";
import {messagingService} from "../../../service/messagingService";

function MentorMatches() {
    const [messages, setMessages] = useState<DocItem<Message>[]>([]);

    const fetchMessages = async () => {
        const user = await authService.getSignedInUser();
        if (user) {
            try {
                const result = await messagingService.getAwaitingMessagesSentForMentor(user.uid);
                setMessages(result.length ? result : []);
            } catch (error) {
                console.error("Error fetching mentor messages:", error);
                setMessages([]);
            }
        }
    };

    const updateMessageStatus = async (docId: string, message: Message, reply: MentorReply) => {
        const user = await authService.getSignedInUser();
        if (user) {
            try {
                const result = await messagingService.mentorReply(docId, message, reply);
                await fetchMessages();
            } catch (error) {
                console.error("Error replying to message:", error);
            }
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const acceptMessage = (message: DocItem<Message>, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        updateMessageStatus(message.docId, message.data, MentorReply.accepted);
    };

    const declineMessage = (message: DocItem<Message>, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

        updateMessageStatus(message.docId, message.data, MentorReply.denied);
    };

    return (
        <ContentContainer
            title="Mentee Matches"
            subtitle="A list of mentees that have matched with you"
        >
            <Box sx={{ width: '30%', maxWidth: '500px', minWidth: '300px', bgcolor: 'background.paper', padding: 2, margin: 'auto' }}>
                <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
                    {messages.map((message) => (
                        <Grid item xs={12} key={message.docId} sx={{ maxWidth: 700, width: '100%' }}>
                            <MessageCard
                                message={message}
                                onAccept={(event) => acceptMessage(message, event)}
                                onDecline={(event) => declineMessage(message, event)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ContentContainer>
    );
}

export default MentorMatches;
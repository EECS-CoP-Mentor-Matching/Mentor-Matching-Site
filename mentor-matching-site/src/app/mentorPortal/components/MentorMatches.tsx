import React, { useState, useEffect } from 'react';
import ContentContainer from "../../common/ContentContainer";
import { Box, Grid, Typography } from "@mui/material";
import authService from "../../../service/authService";
import { DocItem } from '../../../types/types';
import MessageCard from "./MessageCard";
import {MatchProfile, Message} from "../../../types/matchProfile";
import {messagingService} from "../../../service/messagingService";

function MentorMatches() {
    const [messages, setMessages] = useState<DocItem<Message>[]>([]);

    const fetchMessages = async () => {
        const user = await authService.getSignedInUser();
        if (user) {
            try {
                const result = await messagingService.getMessagesSentForMentor(user.uid);
                setMessages(result.length ? result : []);
            } catch (error) {
                console.error("Error fetching mentor messages:", error);
                setMessages([]);
            }
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const acceptMessage = (message: DocItem<Message>, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

    };

    const declineMessage = (message: DocItem<Message>, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();

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
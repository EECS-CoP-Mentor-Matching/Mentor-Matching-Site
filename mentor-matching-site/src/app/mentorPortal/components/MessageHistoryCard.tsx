import React from 'react';
import {Box, Button, Chip, ListItemText, Paper, Typography} from '@mui/material';
import { DocItem } from "../../../types/types";
import {MentorReply, Message} from "../../../types/matchProfile";

interface MessageCardProps {
    message: DocItem<Message>
}

const MessageHistoryCard = ({
                         message,
                     }: MessageCardProps) => {

    const cardStyle = {
        border: '1px solid #e0e0e0',
        margin: '10px 0',
        padding: '20px',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '700px',
        transition: '0.3s',
        '&:hover': {
            backgroundColor: '#f3f3f3',
        },
    };

    const sentOnDate = message.data.sentOn.toDate();

    return (
        <Paper elevation={2} sx={cardStyle}>
            <Box sx={{ padding: 3, textAlign: 'left', overflow: 'hidden' }}>
                <Typography variant="subtitle1" gutterBottom>
                    Message from {message.data.sentByUID === message.data.menteeUID ? "Mentee" : "Mentor"}:
                </Typography>
                <Typography variant="body1" gutterBottom mb={2}>
                    {message.data.message}
                </Typography>

                <Box display="flex" alignItems="center" mb={2} gap={1}>
                    <Chip label={message.data.technicalInterest || "N/A"} color="secondary" />
                    <Chip label={message.data.professionalInterest || "N/A"} color="secondary" />
                </Box>

                <Typography variant="caption" display="block" mb={2}>
                    Sent on: {sentOnDate.toLocaleDateString()} at {sentOnDate.toLocaleTimeString()}
                </Typography>

                <Box display="flex" gap={2} alignItems="center" mt={2}>
                    Status: {MentorReply[parseInt(message.data.mentorReply, 10)]}
                </Box>
            </Box>
        </Paper>
    );
};

export default MessageHistoryCard;

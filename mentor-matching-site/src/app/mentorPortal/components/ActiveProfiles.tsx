import React, { useState, useEffect } from 'react';
import ContentContainer from "../../common/ContentContainer";
import {Box, List, ListItem, ListItemText, Divider, Paper} from "@mui/material";
import authService from "../../../service/authService";
import {mentorService} from "../../../service/mentorService";
import {MatchProfile} from "../../../types/matchProfile";

function ActiveProfiles() {
    const [mentorProfiles, setMentorProfiles] = useState<(MatchProfile & { id: string })[]>([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            const user = await authService.getSignedInUser();
            if (user) {
                try {
                    const result = await mentorService.searchMentorProfilesByUser(user.uid);
                    if (result.success) {
                        setMentorProfiles(result.mentorProfiles || []);
                    } else {
                        console.error("Failed to fetch mentor profiles:", result.error);
                    }
                } catch (error) {
                    console.error("Error fetching mentor profiles:", error);
                }
            }
        };

        fetchProfiles();
    }, []);

    const profileItemStyle = {
        border: '1px solid #e0e0e0',
        margin: '10px 0',
        padding: '10px',
        borderRadius: '4px',
        width: '80%',
        maxWidth: '700px',
        marginLeft: 'auto',
        marginRight: 'auto',
    };

    return (
        <ContentContainer
            title="Active Profiles"
            subtitle="A collection of the profiles that you've created"
        >
            <p>Here are your active profiles:</p>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <List component="nav" aria-label="mentor profiles">
                    {mentorProfiles.map((profile, index) => (
                        <React.Fragment key={profile.id}>
                            <Paper elevation={2} style={profileItemStyle}>
                                <ListItem>
                                    <ListItemText
                                        primary={`Profile ID: ${profile.id}`}
                                        secondary={`
                                            Technical Interest: ${profile.technicalInterest} (${profile.technicalExperience} years), 
                                            Professional Interest: ${profile.professionalInterest} (${profile.professionalExperience} years)
                                        `}
                                    />
                                </ListItem>
                                {index < mentorProfiles.length - 1 && <Divider />}
                            </Paper>
                        </React.Fragment>
                    ))}
                </List>
            </Box>
        </ContentContainer>
    );
}

export default ActiveProfiles;

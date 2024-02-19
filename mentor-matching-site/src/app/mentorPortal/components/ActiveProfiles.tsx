import React, { useState, useEffect } from 'react';
import ContentContainer from "../../common/ContentContainer";
import {Box, List, ListItem, ListItemText, Divider, Paper, IconButton, Grid, ButtonBase} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import authService from "../../../service/authService";
import { mentorService } from "../../../service/mentorService";
import { MatchProfile } from "../../../types/matchProfile";
import { DocItem } from '../../../types/types';
import PopupMessage from "../../common/forms/modals/PopupMessage";

function ActiveProfiles() {
    const [mentorProfiles, setMentorProfiles] = useState<DocItem<MatchProfile>[]>([]);
    const [showDeletionModal, setShowDeletionModal] = useState(false);

    const fetchProfiles = async () => {
        const user = await authService.getSignedInUser();
        if (user) {
            try {
                const result = await mentorService.searchMentorProfilesByUser(user.uid);
                setMentorProfiles(result);
            } catch (error) {
                console.error("Error fetching mentor profiles:", error);
            }
        }
    };

    const viewProfile = (id : String) => {
        console.log('Viewing profile', id);
    };

    const editProfile = (id : String) => {
        console.log('Editing profile', id);
    };

    const deleteProfile = async (docId: string, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const user = await authService.getSignedInUser();

        try {
            const response = await mentorService.deleteMentorProfile(docId);
            if (response.success) {
                setShowDeletionModal(true);
                await fetchProfiles();
            }
        } catch (error) {

        }
    };

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

    useEffect(() => {
        fetchProfiles();
    }, []);

    return (
        <ContentContainer
            title="Active Profiles"
            subtitle="A collection of the profiles that you've created"
        >
            <PopupMessage message="Profile successfully deleted!"
                          open={showDeletionModal}
                          setIsOpen={setShowDeletionModal} />
            <p>Here are your active profiles:</p>
            <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <List component="nav" aria-label="mentor profiles">
                    {mentorProfiles.map((profile, index) => (
                        <React.Fragment key={profile.docId}>
                            <Paper elevation={2} style={profileItemStyle}>
                                <ButtonBase
                                    component="div"
                                    style={{ display: 'block', width: '100%' }}
                                    onClick={() => viewProfile(profile.docId)}
                                >
                                <ListItem disablePadding>
                                    <Grid container alignItems="center" justifyContent="space-between">
                                        <Grid item xs>
                                            <ListItemText
                                                primary={`Profile ID: ${profile.docId}`}
                                                secondary={`
                                            Technical Interest: ${profile.data.technicalInterest} (${profile.data.technicalExperience} years), 
                                            Professional Interest: ${profile.data.professionalInterest} (${profile.data.professionalExperience} years)
                                        `}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <IconButton onClick={() => console.log('Editing profile', profile.docId)}><EditIcon /></IconButton>
                                            <IconButton onClick={(event) => deleteProfile(profile.docId, event)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                </ButtonBase>
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

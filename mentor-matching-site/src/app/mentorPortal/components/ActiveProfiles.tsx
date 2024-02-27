import React, { useState, useEffect } from 'react';
import ContentContainer from "../../common/ContentContainer";
import {
    Box,
    List,
    ListItem,
    ListItemText,
    Divider,
    Paper,
    IconButton,
    Grid,
    ButtonBase,
    Typography
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import authService from "../../../service/authService";
import { mentorService } from "../../../service/mentorService";
import { MatchProfile } from "../../../types/matchProfile";
import { DocItem } from '../../../types/types';
import PopupMessage from "../../common/forms/modals/PopupMessage";
import ModalWrapper from "../../common/forms/modals/ModalWrapper";
import ProfileForm, {ProfileFormData} from "../../common/forms/modals/ProfileForm";

function ActiveProfiles() {
    const [mentorProfiles, setMentorProfiles] = useState<DocItem<MatchProfile>[]>([]);
    const [popupText, setPopupText] = useState<string>("");
    const [showPopupModal, setShowPopupModal] = useState(false);
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<DocItem<MatchProfile>>();

    const fetchProfiles = async () => {
        const user = await authService.getSignedInUser();
        if (user) {
            try {
                const result = await mentorService.searchMentorProfilesByUser(user.uid);
                if (result.length === 0) {
                    setMentorProfiles([]);
                } else {
                    setMentorProfiles(result);
                }
            } catch (error) {
                console.error("Error fetching mentor profiles:", error);
                setMentorProfiles([]);
            }
        }
    };

    const viewProfile = (id : String) => {
        console.log('Viewing profile', id);
    };

    const editProfile = (profile: DocItem<MatchProfile>, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        setSelectedProfile(profile);
        setShowEditProfileModal(true);
    };

    const deleteProfile = async (profile: DocItem<MatchProfile>, event: React.MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        const user = await authService.getSignedInUser();

        if (!user) {
            console.error("User not signed in");
            return;
        }

        try {
            const response = await mentorService.deleteMentorProfile(profile.docId);
            if (response.success) {
                setPopupText("Profile successfully deleted!")
                setShowPopupModal(true);
                await fetchProfiles();
            } else {
                console.error("Failed to delete profile");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
        }
    };

    const handleEditProfile = async (profileFormData: ProfileFormData) => {
        const user = await authService.getSignedInUser();
        if (selectedProfile) {
            if (user) {
                const matchFormData: MatchProfile = {
                    UID: user.uid,
                    technicalInterest: profileFormData.technicalInterest,
                    technicalExperience: profileFormData.technicalExperience,
                    professionalInterest: profileFormData.professionalInterest,
                    professionalExperience: profileFormData.professionalExperience
                };

                try {
                    const response = await mentorService.editMentorProfile(selectedProfile.docId, matchFormData);
                    setPopupText(response.success ? "Successfully edited profile" : response.error as string);
                    setShowEditProfileModal(false);

                    await fetchProfiles();
                } catch (error) {
                    setPopupText("An error occurred while creating the profile: " + error);
                }
            } else {
                setPopupText("Error authenticating user");
            }
        } else {
            setPopupText("Error selecting profile");
        }
        setShowPopupModal(true);
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
        void fetchProfiles();
    }, []);

    return (
        <ContentContainer
            title="Active Profiles"
            subtitle="A collection of the profiles that you've created"
        >
            <ModalWrapper children={
                <Box>
                    <Typography variant="h6">Editing Mentor Profile ID: {selectedProfile?.docId}</Typography>
                    <ProfileForm
                        onSubmit={handleEditProfile}
                        initialProfileFormData={{
                            technicalInterest: selectedProfile?.data.technicalInterest || '',
                            technicalExperience: Number(selectedProfile?.data.technicalExperience),
                            professionalInterest: selectedProfile?.data.professionalInterest || '',
                            professionalExperience: Number(selectedProfile?.data.professionalExperience),
                        }}
                    />
                </Box>
            }
                  open={showEditProfileModal}
                  setIsOpen={setShowEditProfileModal}
            />
            <PopupMessage message={popupText}
                          open={showPopupModal}
                          setIsOpen={setShowPopupModal} />
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
                                            <IconButton onClick={(event) => editProfile(profile, event)}>
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={(event) => deleteProfile(profile, event)}>
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

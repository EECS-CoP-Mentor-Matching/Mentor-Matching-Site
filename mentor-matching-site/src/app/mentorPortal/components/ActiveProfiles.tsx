import React, { useState, useEffect } from 'react';
import ContentContainer from "../../common/ContentContainer";
import {
    Box,
    Grid,
    Typography
} from "@mui/material";
import authService from "../../../service/authService";
import { mentorService } from "../../../service/mentorService";
import { MatchProfile } from "../../../types/matchProfile";
import { DocItem } from '../../../types/types';
import ModalWrapper from "../../common/forms/modals/ModalWrapper";
import ProfileForm, {ProfileFormData} from "../../common/forms/modals/ProfileForm";
import ProfileCard from "../../common/forms/modals/ProfileCard";

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

    const editProfile = (profile: DocItem<MatchProfile>, event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setSelectedProfile(profile);
        setShowEditProfileModal(true);
    };

    const deleteProfile = async (profile: DocItem<MatchProfile>, event: React.MouseEvent<HTMLElement>) => {
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

    useEffect(() => {
        void fetchProfiles();
    }, []);

    return (
        <ContentContainer
            title="Active Profiles"
            subtitle="A collection of the profiles that you've created"
        >
            {}
            <ModalWrapper
                open={showEditProfileModal}
                setIsOpen={setShowEditProfileModal}
                children={
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
            />
            <ModalWrapper
                open={showPopupModal}
                setIsOpen={setShowPopupModal}
                children={
                    <Box>
                        <Typography variant="h6">{popupText}</Typography>
                    </Box>
                }
            />
            <Box sx={{ width: '60%', bgcolor: 'background.paper', padding: 2, margin: 'auto' }}>
                <Grid container rowSpacing={0} columnSpacing={3} justifyContent="center">
                    {mentorProfiles.map((profile) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={profile.docId}>
                            <ProfileCard
                                profile={profile}
                                onEdit={(event) => editProfile(profile, event)}
                                onDelete={(event) => deleteProfile(profile, event)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </ContentContainer>
    );
}

export default ActiveProfiles;
